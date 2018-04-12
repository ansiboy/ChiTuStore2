module.exports = function (grunt) {

    var src_user_root = 'src';
    var dest_user_root = 'www';

    var ts_options = {
        module: 'amd',
        target: 'es6',
        removeComments: true,
        sourceMap: false,
    };

    grunt.initConfig({
        shell: {
            ts_user: {
                command: 'tsc -p src',
                options: {
                    failOnError: false
                }
            }
        },
        babel: {
            es5: {
                options: {
                    sourceMap: false,
                    presets: ["es2015"],
                },
                files: [
                    { expand: true, cwd: `${dest_user_root}`, src: [`modules/**/*.js`], dest: 'www_es5' },
                    { expand: true, cwd: `${dest_user_root}`, src: [`js/chitu.js`], dest: 'www_es5' },
                    { expand: true, cwd: `${dest_user_root}`, src: [`js/ui.js`], dest: 'www_es5' },
                    { expand: true, cwd: `${dest_user_root}`, src: [`index.js`], dest: 'www_es5' },
                ]
            }
        },
        // 通过connect任务，创建一个静态服务器
        connect: {
            www: {
                options: {
                    // 服务器端口号
                    port: 8179,
                    // 服务器地址(可以使用主机名localhost，也能使用IP)
                    // hostname: '192.168.1.9',
                    hostname: '127.0.0.1',
                    // keepalive: true,
                    livereload: 33625,
                    // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
                    base: 'www',
                    open: true
                }
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: 33625 //监听前面声明的端口  35729
                },
                files: [
                    `www`
                ]
            }
        },
        copy: {
            www: {
                files: [
                    {
                        expand: true, cwd: src_user_root, dest: dest_user_root,
                        src: ['js/**/*.js', 'content/**/*.css', 'content/font/*.*', 'images/**/*.*', 'index.html'],
                    },
                ],
            },
            ios: {
                files: [{ expand: true, cwd: '.', src: 'www/**/*.*', dest: 'platforms/ios' }]
            },
            android: {
                files: [{ expand: true, cwd: '.', src: 'www/**/*.*', dest: 'platforms/android/assets' }]
            },
            www_es5: {
                files: [
                    {
                        expand: true, cwd: dest_user_root, dest: 'www_es5',
                        src: ['js/**/*.js', '!js/chitu.js', '!js/ui.js', 'content/**/*.css', 'content/font/*.*', 'images/**/*.*', 'index.html'],
                    },
                ],
            },
            release: {
                files: [
                    {
                        expand: true, cwd: dest_user_root, dest: '../release/user',
                        src: ['js/**/*.js', 'content/**/*.css', 'content/font/*.*', 'images/**/*.*', 'index.html'],
                    },
                ],
            },
            releaseToWWW: {
                files: [{ expand: true, cwd: '../release/user', src: '**/*.js', dest: `${dest_user_root}` }]
            }
        },
        less: {
            user: {
                files: [
                    {
                        expand: true,
                        cwd: src_user_root + `/modules`,
                        src: ['**/*.less'],
                        dest: `${dest_user_root}/content/app`,
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: src_user_root,
                        src: [`*.less`],
                        dest: `${dest_user_root}/content/app`,
                        ext: '.css'
                    },
                    { expand: false, src: `${src_user_root}/content/bootstrap-3.3.5/bootstrap.less`, dest: `${dest_user_root}/content/css/bootstrap.css` }
                ]
            }
        },
        concat: {
            dest: {
                options: {

                },
                src: [`${src_user_root}/js/hammer.js`, `${src_user_root}/js/bezier-easing.js`, `${dest_user_root}/controls/*.js`],
                dest: `${dest_user_root}/controls.js`,
            }
        },
        uglify: {
            user: {
                files: [{
                    expand: true,
                    cwd: `www_es5`,
                    src: '**/*.js',
                    dest: `../release/user`
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['shell', 'less', 'concat', 'copy:www']);
    grunt.registerTask('es5', ['babel', 'copy:www_es5']);
    grunt.registerTask('dist', ['uglify', 'copy:releaseToWWW']);
    // grunt.registerTask('default', ['shell', 'less', 'concat', 'babel', 'copy:www', 'copy:www_es5', 'copy:ios', 'copy:android']);
    // grunt.registerTask('release', ['shell']);
}