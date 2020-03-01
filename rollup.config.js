import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import svg from 'rollup-plugin-svg'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/renderer/App.js',
  output: {
    name: 'BetaflightInspector',
    file: 'static/build/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: css => {
        css.write('static/build/bundle.css')
      }
    }),
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    svg(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
}

function serve () {
  let started = false

  return {
    writeBundle () {
      if (!started) {
        started = true

        require('child_process')
          .spawn('npm', ['run', 'start'], {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true,
            env: { DEBUG: 'yes', PATH: process.env.PATH }
          })
          // Stop watch mode when electron exits
          .once('exit', (code) => process.exit(code))
      }
    }
  }
}
