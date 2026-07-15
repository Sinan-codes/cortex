import { Navigate, Route, Routes } from 'react-router'

import LandingPage from './pages/LandingPage'
import AppLayout from './layouts/AppLayout'
import DocumentsPage from './pages/DocumentsPage'
import ConversationsPage from './pages/ConversationsPage'
import ConversationPage from './pages/ConversationPage'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/chat" element={<ConversationsPage />} />
          <Route path="/chat/:conversationId" element={<ConversationPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
