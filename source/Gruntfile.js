module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            TypeScript: {
                command: 'node node_modules/typescript/bin/tsc.js bootstrap.ts --out ../hash-routing.js --sourceMap'
            }
        },
        less: {
            development: {
                options: {
                },
                files: {
                    "../css/style.css": "less/style.less"
                }
            },
            prod: {
                options: {
                    compress: true
                },
                files: {
                    "../css/style.min.css": "less/style.less"
                }
            }
        },
        uglify: {
            options: {
                banner: [
                    '/*! <%= pkg.name %> - v<%= pkg.version %> - ',
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
                ].join('')
            },
            prod: {
                files: {
                    '../hash-routing.min.js': ['../hash-routing.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['**/*.ts', 'source/less/*.less'],
                tasks: ['shell']
            },
            styles: {
                files: ['source/less/*.less'],
                tasks: ['less:development']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['less:development', 'shell', 'watch']);
    grunt.registerTask('prod', ['less:prod', 'shell', 'uglify:prod']);

};