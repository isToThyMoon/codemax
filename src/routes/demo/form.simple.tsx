import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { useAppForm } from '@/hooks/demo.form'

export const Route = createFileRoute('/demo/form/simple')({
  component: SimpleForm,
})

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
})

function SimpleForm() {
  const form = useAppForm({
    defaultValues: {
      title: '',
      description: '',
    },
    validators: {
      onBlur: schema,
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Simple Form</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <form.AppField name="title">
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <field.TextField
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
                />
              </div>
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <field.TextArea
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm min-h-[100px]"
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
