import { Page, defaultNavBar, app, formatDate } from 'site';
import { ShopService, AccountService, Order } from 'services';
import { SetAddress, RouteValue } from 'modules/user/receiptList';

let { PageComponent, PageHeader, PageFooter, PageView, Button, ImageBox } = controls;

export default function (page: Page) {
    class OrderDetailPage extends React.Component<{ order: Order }, {}> {
        private purchase() {
            return Promise.reject<any>(null);
        }
        private confirmReceived() {
            return Promise.reject<any>(null);
        }
        private cancelOrder() {
            return Promise.reject<any>(null);
        }
        render() {
            let order = this.props.order;
            return (
                <PageComponent>
                    <PageHeader>{defaultNavBar({ title: '订单详情' })}</PageHeader>
                    <PageView>
                        <div className="container order" style={{ paddingTop: 10 }}>
                            <div className="list">

                                <div className="form-group">
                                    <label>订单状态：</label>
                                    <span style={{ color: '#f70' }}>{order.StatusText}</span>
                                </div>
                                <div className="form-group">
                                    <label>订单编号：</label>
                                    <span>{order.Serial}</span>
                                </div>
                                <div className="form-group">
                                    <label className="pull-left">
                                        订单总计：
                                        </label>
                                    <div>
                                        <span className="price">¥{order.Sum.toFixed(2)}</span>
                                        <span style={{ paddingLeft: 10 }}>(邮费：¥{order.Freight.toFixed(2)})</span>
                                        {order.Status == 'WaitingForPayment' && order.BalanceAmount > 0 ?
                                            <div>
                                                <strong>已付：</strong><span>¥{order.BalanceAmount.toFixed(2)}</span>
                                                &nbsp;&nbsp;
                                                <strong>待付：</strong><span>¥{(order.Sum - order.BalanceAmount).toFixed(2)}</span>
                                            </div> : null}
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="form-group">
                                    <label className="pull-left">收货信息：</label>
                                    <div style={{ marginLeft: 70 }}>{order.ReceiptAddress}</div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="form-group">
                                    <label>下单时间：</label>
                                    <span>{formatDate(order.OrderDate)}</span>
                                </div>

                                {order.Status == 'WaitingForPayment' ?
                                    <div className="form-group">
                                        <Button onClick={() => this.purchase()} className="btn btn-block btn-primary">微信支付</Button>
                                    </div> : null}
                                {order.Status == 'Send' ?
                                    <div className="form-group">
                                        <Button onClick={() => this.confirmReceived()} confirm={'你确定收到货了吗？'} className="btn btn-primary btn-block">确认收货</Button>
                                    </div> : null}
                            </div>
                        </div>
                        <div data-bind="visible:expressCompany" className="container order" style={{ display: 'none' }}>
                            <h4 className="light">物流信息</h4>
                            <div className="list">
                                <div className="box padding-lr-15">
                                    <p>快递公司：<span data-bind="text:expressCompany"></span></p>
                                    <p>快递单号：<span data-bind="text:expressBillNo"></span></p>
                                </div>
                            </div>
                        </div>
                        <div data-bind="with:order" className="container order">
                            <div>
                                <h4 className="text-primary" style={{ fontWeight: 'bold' }}>购物清单</h4>
                            </div>
                            <div name="orderDetails" className="list">
                                {order.OrderDetails.map((o, i) => (
                                    <div>
                                        <hr key={i} className="row" />
                                        <div key={`OrderDetail${i}`} className="row">
                                            <div className="col-xs-4" style={{ paddingRight: 0 }}>
                                                <a href={`#home_product?id=${o.ProductId}`}>
                                                    <ImageBox src={o.ImageUrl} className="img-responsive" />
                                                </a>
                                            </div>
                                            <div className="col-xs-8">
                                                <a href="#" className="title">
                                                    {o.ProductName}
                                                </a>
                                                <div>价格：<span className="price" data-bind="money:Price">¥{o.Price.toFixed(2)}</span></div>
                                                <div>数量：<span className="price" data-bind="text:Quantity">{o.Quantity}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {order.Status == 'WaitingForPayment' ?
                            <div data-bind="with:order" className="container" style={{ paddingTop: 10, paddingBottom: 20 }}>
                                <Button onClick={() => this.cancelOrder()} confirm={"你取消该定单吗？"}
                                    className="btn btn-block btn-default">取消订单</Button>
                            </div> : null}
                    </PageView>
                    <PageFooter>
                    </PageFooter>
                </PageComponent>
            );
        }
    }

    let shop = page.createService(ShopService);
    shop.order(page.routeData.values.id).then(order => {
        ReactDOM.render(<OrderDetailPage order={order} />, page.element);
    })
}