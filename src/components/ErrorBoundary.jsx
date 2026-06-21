import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <span style={styles.label}>SYSTEM ERROR</span>
            <p style={styles.message}>Visualization failed to render.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={styles.retry}
            >
              RETRY
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#050a10',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: 32,
    border: '1px solid rgba(0, 245, 196, 0.2)',
    borderRadius: 2,
    background: '#10200C',
    color: '#00F5C4',
    fontFamily: 'var(--v-font)',
  },
  label: {
    fontSize: 10,
    letterSpacing: '0.08em',
    opacity: 0.6,
  },
  message: {
    fontSize: 14,
    margin: 0,
  },
  retry: {
    background: '#00F5C4',
    color: '#10200C',
    border: 'none',
    padding: '8px 24px',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    fontFamily: 'var(--v-font)',
    borderRadius: 2,
  },
}
