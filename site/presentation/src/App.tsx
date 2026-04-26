import { Routes, Route, Navigate } from 'react-router-dom'
import SlideView from '@/components/SlideView'
import PresenterView from '@/components/PresenterView'
import PatternsView from '@/components/PatternsView'
import PatternsCategoryView from '@/components/PatternsCategoryView'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/slide/1" replace />} />
      <Route path="/slide/:index" element={<SlideView />} />
      <Route path="/presenter" element={<PresenterView />} />
      <Route path="/patterns" element={<PatternsView />} />
      <Route path="/patterns/:categoryId" element={<PatternsCategoryView />} />
      <Route path="*" element={<Navigate to="/slide/1" replace />} />
    </Routes>
  )
}
