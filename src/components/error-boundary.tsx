import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
          <p className="mt-2 text-muted-foreground">Maaf, aplikasi mengalami masalah. Silakan muat ulang halaman.</p>
          <button
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => window.location.reload()}
          >
            Muat Ulang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
