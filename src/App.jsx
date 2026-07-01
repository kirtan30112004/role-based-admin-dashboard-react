import { BrowserRouter }    from 'react-router-dom';
import { AuthProvider }     from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { DepartmentProvider } from './context/DepartmentContext';
import { ToastContainer }   from './components/ui/Toast';
import AppRouter            from './routes/AppRouter';

/**
 * App root — provider stack (order matters):
 *  1. BrowserRouter      — history context
 *  2. AuthProvider       — session / role (reads localStorage on mount)
 *  3. EmployeeProvider   — employee CRUD + localStorage sync
 *  4. DepartmentProvider — department CRUD; reads EmployeeContext for headcounts
 *  5. AppRouter          — all route definitions
 *  6. ToastContainer     — portal-rendered toast notifications (no provider needed)
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EmployeeProvider>
          <DepartmentProvider>
            <AppRouter />
            <ToastContainer />
          </DepartmentProvider>
        </EmployeeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
