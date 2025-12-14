import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './AppRouter'

// 添加错误边界
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('应用错误:', error, errorInfo)
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          color: '#666'
        }}>
          <h2>魔法关键词看板</h2>
          <p>应用加载时出现错误，请刷新页面重试</p>
          <p style={{ fontSize: '14px', marginTop: '20px' }}>
            如果问题持续存在，请检查浏览器控制台错误信息
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </React.StrictMode>
)
