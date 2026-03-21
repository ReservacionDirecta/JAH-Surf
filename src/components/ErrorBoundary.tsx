import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      let errorMessage = "Ocurrió un error inesperado.";
      
      try {
        // Check if it's a Firestore error JSON
        const firestoreError = JSON.parse(error?.message || "");
        if (firestoreError.error) {
          errorMessage = `Error de base de datos: ${firestoreError.error}`;
        }
      } catch (e) {
        // Not a JSON error, use the raw message if available
        if (error?.message) {
          errorMessage = error.message;
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="glass p-12 rounded-[2rem] text-center max-w-md w-full shadow-2xl border-red-100 border-2">
            <h2 className="text-3xl font-display font-black mb-4 uppercase tracking-tighter text-red-600">Ups!</h2>
            <p className="text-slate-600 mb-8 font-medium">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:scale-105 transition-all"
            >
              REINTENTAR
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
