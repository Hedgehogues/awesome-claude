import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  slideIndex: number
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class SlideErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Slide ${this.props.slideIndex} render failed`, error, info)
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when navigating to a different slide
    if (prevProps.slideIndex !== this.props.slideIndex && this.state.error) {
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="slide-error">
          <div className="slide-error-title">Ошибка в слайде {this.props.slideIndex}</div>
          <div className="slide-error-message">{this.state.error.message}</div>
          <div className="slide-muted">Навигация продолжает работать. Перейди к следующему.</div>
        </div>
      )
    }
    return this.props.children
  }
}
