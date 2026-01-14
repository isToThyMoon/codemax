import { createFileRoute } from '@tanstack/react-router'

import { useAppForm } from '@/hooks/demo.form'

export const Route = createFileRoute('/demo/form/address')({
  component: AddressForm,
})

function AddressForm() {
  const form = useAppForm({
    defaultValues: {
      fullName: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      phone: '',
    },
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (value.fullName.trim().length === 0) {
          errors.fields.fullName = 'Full name is required'
        }
        return errors
      },
    },
    onSubmit: ({ value }) => {
      console.log(value)
      // Show success message
      alert('Form submitted successfully!')
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-2xl p-8 rounded-xl bg-white border border-gray-200 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Address Form</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <form.AppField name="fullName">
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <field.TextField className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm" />
              </div>
            )}
          </form.AppField>

          <form.AppField
            name="email"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Email is required'
                }
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return 'Invalid email address'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <field.TextField className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm" />
              </div>
            )}
          </form.AppField>

          <form.AppField
            name="address.street"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Street address is required'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Street Address</label>
                <field.TextField className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm" />
              </div>
            )}
          </form.AppField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form.AppField
              name="address.city"
              validators={{
                onBlur: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'City is required'
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <field.TextField className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm" />
                </div>
              )}
            </form.AppField>
            <form.AppField
              name="address.state"
              validators={{
                onBlur: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'State is required'
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <field.TextField className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm" />
                </div>
              )}
            </form.AppField>
            <form.AppField
              name="address.zipCode"
              validators={{
                onBlur: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'Zip code is required'
                  }
                  if (!/^\d{5}(-\d{4})?$/.test(value)) {
                    return 'Invalid zip code format'
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Zip Code</label>
                  <field.TextField className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm" />
                </div>
              )}
            </form.AppField>
          </div>

          <form.AppField
            name="address.country"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Country is required'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Country</label>
                <field.Select
                  values={[
                    { label: 'United States', value: 'US' },
                    { label: 'Canada', value: 'CA' },
                    { label: 'United Kingdom', value: 'UK' },
                    { label: 'Australia', value: 'AU' },
                    { label: 'Germany', value: 'DE' },
                    { label: 'France', value: 'FR' },
                    { label: 'Japan', value: 'JP' },
                  ]}
                  placeholder="Select a country"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
                />
              </div>
            )}
          </form.AppField>

          <form.AppField
            name="phone"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Phone number is required'
                }
                if (
                  !/^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
                    value,
                  )
                ) {
                  return 'Invalid phone number format'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <field.TextField
                  placeholder="123-456-7890"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
                />
              </div>
            )}
          </form.AppField>

          <div className="flex justify-end">
            <form.AppForm>
              <form.SubscribeButton
                label="Submit"
                className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              />
            </form.AppForm>
          </div>
        </form>
      </div>
    </div>
  )
}
