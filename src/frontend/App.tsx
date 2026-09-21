
import './App.css';
import {lazy, Suspense} from 'react';
import { Routes, Route } from "react-router-dom";
import HeaderAndSidebar from "./src/components/HeaderAndSidebar";
import ProtectedRoute from "./src/components/ProtectedRoute";
import NotesList from "./src/components/NotesList";
//import TiptapEditor from "./src/pages/Editor";
import Home from "./src/pages/Home";
import Signin from "./src/pages/Signin";
import SignUp from "./src/pages/SignUp";
const Editor = lazy(() => import('./src/pages/Editor'));

function App() {

	return (
		<>
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<Home />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/signup" element={<SignUp />} />

				
				{/* Protected Routes */}
				<Route element={<ProtectedRoute />}>
				<Route path="/notes" element={<NotesList />} />
					<Route path="/note" element={<HeaderAndSidebar />}>

						<Route path=":id" element={
							<Suspense fallback={
              <div className="flex-1 flex items-center justify-center text-slate-500">
                Loading editor...
              </div>
            }>
              <Editor />
            </Suspense>
							} />
					</Route>
				</Route>




				{/* catch all routes */}
				<Route path="*" element={"catch all"} />

			</Routes>
		</>
	)
}

export default App
