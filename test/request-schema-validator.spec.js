import assert from 'assert'
import validate from '../lib/request-schema-validator.js'

describe('request-schema-validator', () => {
  describe('main logic', () => {
    it('should return with error if data is undefined', () => {
      const isValid = validate(undefined)
      assert.strictEqual(isValid, false)
      assert.strictEqual(validate.errors.length, 1)
      assert.strictEqual(validate.errors[0].message, 'Request body should be a EmailRequest type')
    })

    it('should return with error if data is null', () => {
      const isValid = validate(null)
      assert.strictEqual(isValid, false)
      assert.strictEqual(validate.errors.length, 1)
      assert.strictEqual(validate.errors[0].message, 'Request body should be a EmailRequest type')
    })

    it('should be invalid if empty object', () => {
      const isValid = validate({})
      assert.strictEqual(isValid, false)
    })

    it('should be valid if every required property and html property provided', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        html: '<html lang="en"></html>'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be valid if every required property and text property provided', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })
  })

  describe('from', () => {

    it('should be invalid if from property missing', () => {
      const isValid = validate({
        to: [{ email: 'to@example.com' }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })

    it('should be valid if the email property provided', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be valid if the email and name properties provided', () => {
      const isValid = validate({
        from: { email: 'admin@example.com', name: 'Example Admin' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be invalid if only name property provided', () => {
      const isValid = validate({
        from: { name: 'Example Admin' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })

    it('should be invalid if empty property provided', () => {
      const isValid = validate({
        from: {},
        to: [{ email: 'to@example.com' }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })

  })

  describe('to', () => {

    it('should be invalid if to property is missing', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })

    it('should be invalid if to property empty array', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })

    it('should be invalid if to property array contains an empty object', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{}],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })

    it('should be valid if to property has email property', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com'
        }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be valid if to property has email and name properties', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com',
          name: 'To Example'
        }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be valid if to property has multiple entry', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [
          {
            email: 'to@example.com',
            name: 'To Example'
          },
          {
            email: 'to2@example.com',
            name: 'To2 Example'
          },
        ],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be invalid if to property has duplicated entries', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [
          {
            email: 'to@example.com',
            name: 'To Example'
          },
          {
            email: 'to2@example.com',
            name: 'To2 Example'
          },
          {
            email: 'to@example.com',
            name: 'To Example'
          }
        ],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })
  })

  describe('cc', () => {

    it('should be valid if cc property is missing', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com'
        }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be invalid if cc property empty array', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com'
        }],
        cc: [],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be invalid if cc property array contains an empty object', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com'
        }],
        cc: [{}],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })

    it('should be valid if cc property has email property', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com'
        }],
        cc: [{
          email: 'cc@example.com'
        }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be valid if cc property has email and name properties', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com',
          name: 'To Example'
        }],
        cc: [{
          email: 'cc@example.com',
          name: 'Cc Example'
        }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be valid if cc property has multiple entry', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [
          {
            email: 'to@example.com',
            name: 'To Example'
          }
        ],
        cc: [
          {
            email: 'cc@example.com',
            name: 'Cc Example'
          },
          {
            email: 'cc2@example.com',
            name: 'CC2 Example'
          },
        ],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be invalid if cc property has duplicated entries', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [
          {
            email: 'to@example.com',
            name: 'To Example'
          }
        ],
        cc: [
          {
            email: 'cc@example.com',
            name: 'Cc Example'
          },
          {
            email: 'cc2@example.com',
            name: 'Cc2 Example'
          },
          {
            email: 'cc@example.com',
            name: 'Cc Example'
          }
        ],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })
  })

  describe('bcc', () => {

    it('should be valid if bcc property is missing', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com'
        }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be invalid if bcc property empty array', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com'
        }],
        bcc: [],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be invalid if bcc property array contains an empty object', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com'
        }],
        cc: [{}],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })

    it('should be valid if bcc property has email property', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com'
        }],
        bcc: [{
          email: 'bcc@example.com'
        }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be valid if cc property has email and name properties', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{
          email: 'to@example.com',
          name: 'To Example'
        }],
        bcc: [{
          email: 'bcc@example.com',
          name: 'Bcc Example'
        }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be valid if bcc property has multiple entry', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [
          {
            email: 'to@example.com',
            name: 'To Example'
          }
        ],
        cc: [
          {
            email: 'bcc@example.com',
            name: 'Bcc Example'
          },
          {
            email: 'bcc2@example.com',
            name: 'Bcc2 Example'
          },
        ],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be invalid if bcc property has duplicated entries', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [
          {
            email: 'to@example.com',
            name: 'To Example'
          }
        ],
        bcc: [
          {
            email: 'bcc@example.com',
            name: 'Bcc Example'
          },
          {
            email: 'bcc2@example.com',
            name: 'Bcc2 Example'
          },
          {
            email: 'bcc@example.com',
            name: 'Bcc Example'
          }
        ],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })
  })

  describe('attachments', () => {
    it('should be valid if its an empty array', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text',
        test: true,
        attachments: []
      })
      assert.strictEqual(isValid, true)
    })

    it('should be invalid if attachment is an empty object', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text',
        test: true,
        attachments: [{}]
      })
      assert.strictEqual(isValid, false)
    })

    it('should be valid if content and file name properties are provided', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text',
        test: true,
        attachments: [
          {
            content: 'bla',
            filename: 'bla.txt'
          }
        ]
      })
      assert.strictEqual(isValid, true)
    })

  })

  describe('dkim', () => {
    it('should be invalid if required fields are missing', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text',
        dkim: {}
      })
      assert.strictEqual(isValid, false)
    })

    it('should be valid if required fields provided', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text',
        dkim: {
          domainName: 'domain name',
          keySelector: 'key',
          privateKey: 'private key'
        }
      })
      assert.strictEqual(isValid, true)
    })
  })

  describe('replyTo', () => {
    it('should invalid if empty object provided', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        replyTo: {},
        to: [{ email: 'to@example.com' }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, false)
    })

    it('should be valid if email property has a value', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        replyTo: { email: 'reply@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })

    it('should be valid if email and name properties have value', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        replyTo: { email: 'reply@example.com', name: 'Reply To' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text'
      })
      assert.strictEqual(isValid, true)
    })
  })

  describe('test', () => {
    it('should be valid if value = true', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text',
        test: true,
      })
      assert.strictEqual(isValid, true)
    })

    it('should be valid if value = false', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text',
        test: true,
      })
      assert.strictEqual(isValid, true)
    })

    it('should be invalid if value = true string', () => {
      const isValid = validate({
        from: { email: 'admin@example.com' },
        to: [{ email: 'to@example.com' }],
        text: 'pure text',
        test: 'true',
      })
      assert.strictEqual(isValid, false)
    })
  })
})