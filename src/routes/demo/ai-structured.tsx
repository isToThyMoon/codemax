import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChefHat, Clock, Users, Gauge } from 'lucide-react'
import { Streamdown } from 'streamdown'

import type { Recipe } from './api.ai.structured'

type Mode = 'structured' | 'oneshot'

const SAMPLE_RECIPES = [
  'Homemade Margherita Pizza',
  'Thai Green Curry',
  'Classic Beef Bourguignon',
  'Chocolate Lava Cake',
  'Crispy Korean Fried Chicken',
  'Fresh Spring Rolls with Peanut Sauce',
  'Creamy Mushroom Risotto',
  'Authentic Pad Thai',
]

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h3>
        <p className="text-gray-500">{recipe.description}</p>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-black" />
          <span className="text-sm">Prep: {recipe.prepTime}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-black" />
          <span className="text-sm">Cook: {recipe.cookTime}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4 text-black" />
          <span className="text-sm">{recipe.servings} servings</span>
        </div>
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded-full ${
            difficultyColors[recipe.difficulty]
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span className="text-sm capitalize">{recipe.difficulty}</span>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-600">
              <span className="text-black">•</span>
              <span>
                <span className="font-medium text-gray-900">{ing.amount}</span> {ing.item}
                {ing.notes && (
                  <span className="text-gray-400 text-sm"> ({ing.notes})</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h4>
        <ol className="space-y-3">
          {recipe.instructions.map((step, idx) => (
            <li key={idx} className="flex gap-3 text-gray-600">
              <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Tips</h4>
          <ul className="space-y-2">
            {recipe.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-600">
                <span className="text-yellow-500">*</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nutrition */}
      {recipe.nutritionPerServing && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Nutrition (per serving)
          </h4>
          <div className="flex flex-wrap gap-4 text-sm">
            {recipe.nutritionPerServing.calories && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                {recipe.nutritionPerServing.calories} cal
              </span>
            )}
            {recipe.nutritionPerServing.protein && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                Protein: {recipe.nutritionPerServing.protein}
              </span>
            )}
            {recipe.nutritionPerServing.carbs && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                Carbs: {recipe.nutritionPerServing.carbs}
              </span>
            )}
            {recipe.nutritionPerServing.fat && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                Fat: {recipe.nutritionPerServing.fat}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StructuredPage() {
  const [recipeName, setRecipeName] = useState('')
  const [result, setResult] = useState<{
    mode: Mode
    recipe?: Recipe
    markdown?: string
    provider: string
    model: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (mode: Mode) => {
    if (!recipeName.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/demo/api/ai/structured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeName, mode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const canExecute = !!(!isLoading && recipeName.trim() && !error)

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-black rounded-lg">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            One-Shot & Structured Output
          </h1>
        </div>

        <p className="text-gray-500 mb-6">
          Compare two output modes:{' '}
          <strong className="text-black">One-Shot</strong> returns freeform
          markdown, while{' '}
          <strong className="text-black">Structured</strong> returns
          validated JSON conforming to a Zod schema.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Name
            </label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              disabled={isLoading}
              placeholder="e.g., Chocolate Chip Cookies"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
            />

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Picks
              </label>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_RECIPES.map((name) => (
                  <button
                    key={name}
                    onClick={() => setRecipeName(name)}
                    disabled={isLoading}
                    className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg border border-gray-200 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleGenerate('oneshot')}
                disabled={!canExecute}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white ${
                  !canExecute ? 'bg-gray-200 text-gray-400' : 'bg-black hover:bg-gray-800'
                }`}
              >
                One-Shot (Markdown)
              </button>
              <button
                onClick={() => handleGenerate('structured')}
                disabled={!canExecute}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white ${
                  !canExecute ? 'bg-gray-200 text-gray-400' : 'bg-black hover:bg-gray-800'
                }`}
              >
                Structured (JSON)
              </button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="mt-5 lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Generated Recipe
            </h2>
            {result && (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  result.mode === 'structured'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {result.mode === 'structured' ? 'Structured JSON' : 'Markdown'}
              </span>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 mb-4">
              {error}
            </div>
          )}

          {result ? (
            <div className="space-y-4">
              {result.mode === 'structured' && result.recipe ? (
                <RecipeCard recipe={result.recipe} />
              ) : result.markdown ? (
                <div className="prose max-w-none">
                  <Streamdown>{result.markdown}</Streamdown>
                </div>
              ) : null}
            </div>
          ) : !error && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <ChefHat className="w-8 h-8 opacity-50" />
              </div>
              <p>
                Enter a recipe name and click "Generate Recipe" to get started.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/demo/ai-structured')({
  component: StructuredPage,
})
