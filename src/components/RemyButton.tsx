import { ChefHat, ChevronRight } from 'lucide-react'
import { showRemyAssistant } from './RemyAssistant'

export default function RemyButton() {
  return (
    <button
      onClick={() => showRemyAssistant.setState(true)}
      className="group w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-orange-100 text-slate-700 hover:border-orange-500 hover:text-orange-600 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
      aria-label="Open Remy Assistant"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
          <ChefHat size={20} />
        </div>
        <span className="font-semibold text-sm">Remy</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
    </button>
  )
}
