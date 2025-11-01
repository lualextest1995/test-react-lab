import { createContext, useReducer, type ReactNode } from "react";

type User = {
  id: string;
  name: string;
};

type Page = {
  grant: string[];
  name: string;
  path: string;
};

type Permission = {
  name: string;
  page: Page[];
};

export type Permissions = Permission[] | null;

type AuthState = {
  user: User | null;
  permissions: Permissions;
};

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  isReady: boolean;
  login: (user: User) => void;
  logout: () => void;
  setPermissions: (permissions: Permissions) => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

type LoginAction = {
  type: "LOGIN";
  payload: User;
};

type LogoutAction = {
  type: "LOGOUT";
};

type SetPermissionsAction = {
  type: "SET_PERMISSIONS";
  payload: Permissions;
};

type AuthAction = LoginAction | LogoutAction | SetPermissionsAction;

const initialState: AuthState = {
  user: null,
  permissions: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return initialState;
    case "SET_PERMISSIONS":
      return {
        ...state,
        permissions: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const authCtx: AuthContextValue = {
    user: state.user,
    permissions: state.permissions,
    isAuthenticated: state.user !== null,
    isReady: state.user !== null && state.permissions !== null,
    login: (user: User) => {
      dispatch({ type: "LOGIN", payload: user });
    },
    logout: () => {
      dispatch({ type: "LOGOUT" });
    },
    setPermissions: (permissions: Permissions) => {
      dispatch({ type: "SET_PERMISSIONS", payload: permissions });
    },
  };
  return (
    <AuthContext.Provider value={authCtx}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
export { AuthContext };
