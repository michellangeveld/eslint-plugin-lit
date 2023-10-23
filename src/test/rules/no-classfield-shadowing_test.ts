/**
 * @fileoverview Disallows properties shadowed as class field
 * @author Michel Langeveld <https://github.com/michellangeveld>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule = require('../../rules/no-classfield-shadowing');
import {RuleTester} from 'eslint';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parser = require.resolve('@babel/eslint-parser');
const parserOptions = {
  sourceType: 'module',
  ecmaVersion: 'latest',
  requireConfigFile: false,
  babelOptions: {
    plugins: [
      ['@babel/plugin-proposal-decorators', {decoratorsBeforeExport: true}]
    ]
  }
};

const ruleTester = new RuleTester({
  parser,
  parserOptions
});

ruleTester.run('no-classfield-shadowing', rule, {
  valid: [
    `class MyElement extends LitElement {
      static properties = {
        foo: { type: String }
      }
    }`,
    `class MyElement extends LitElement {
      foo;
      properties = {
        foo: { type: String }
      }
    }`,
    `class Foo extends LitElement {
      declare foo: string;

      static properties = {foo: {type: String}};
    }`
  ],

  invalid: [
    {
      code: `class MyElement extends LitElement {
        foo;
        static properties = {foo: {}}
      }`,
      errors: [
        {
          messageId: 'noClassfieldShadowing',
          data: {prop: 'foo'},
          line: 3,
          column: 30
        }
      ]
    },
    {
      code: `class MyElement extends LitElement {
        static properties = {foo: {}}
        foo;
      }`,
      errors: [
        {
          messageId: 'noClassfieldShadowing',
          data: {prop: 'foo'},
          line: 2,
          column: 30
        }
      ]
    },
    {
      code: `class MyElement extends LitElement {
        foo;
        static get properties() { return { foo: {}}};
      }`,
      errors: [
        {
          messageId: 'noClassfieldShadowing',
          data: {prop: 'foo'},
          line: 3,
          column: 44
        }
      ]
    },
    {
      code: `class MyElement extends LitElement {
        static get properties() { return { foo: {}}};
        foo;
      }`,
      errors: [
        {
          messageId: 'noClassfieldShadowing',
          data: {prop: 'foo'},
          line: 2,
          column: 44
        }
      ]
    },
    {
      code: `class Foo extends A(LitElement) {
        foo;
        static properties = { foo: {} };
      }`,
      errors: [
        {
          messageId: 'noClassfieldShadowing',
          data: {prop: 'foo'},
          line: 3,
          column: 31
        }
      ]
    },
    {
      code: `class Foo extends A(B(LitElement)) {
        foo;
        static properties = { foo: {} };
      }`,
      errors: [
        {
          messageId: 'noClassfieldShadowing',
          data: {prop: 'foo'},
          line: 3,
          column: 31
        }
      ]
    },
    {
      code: `class Foo extends A(B(C(LitElement))) {
        foo;
        static properties = { foo: {} };
      }`,
      errors: [
        {
          messageId: 'noClassfieldShadowing',
          data: {prop: 'foo'},
          line: 3,
          column: 31
        }
      ]
    },
    {
      code: `class Foo extends LitElement {
        @property({ type: String })
        foo = 'test';

        static properties = { foo: {} };
      }`,
      errors: [
        {
          messageId: 'noClassfieldShadowing',
          data: {prop: 'foo'},
          line: 5,
          column: 31
        }
      ]
    }
  ]
});
