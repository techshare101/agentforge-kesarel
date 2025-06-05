import InterfaceLayout from './ui/interfaceLayout';
import { ErrorBoundary } from './ui/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <InterfaceLayout />
    </ErrorBoundary>
  );
}

export default App;
