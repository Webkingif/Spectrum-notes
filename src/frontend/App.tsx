import { useState } from 'react';
import './App.css';
import Header from "./components/Header.tsx";
import Sidebar from "./components/Sidebar.tsx";
import {Routes, Route, Outlet} from "react-router-dom";
import HeaderAndSidebar from "./components/HeaderAndSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import NotesList from "./components/NotesList";
import TiptapEditor from "./components/Editor";
import Home from "./components/Home";
import Signin from "./components/Signin";
import SignUp from "./components/SignUp";

function App() {

	return(
		<>
			<Routes>
			    {/* Public Routes */}
				<Route path="/" element={<Home />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/signup" element={<SignUp />} />

				<Route path="/notes" element={<NotesList />} />
				{/* Protected Routes */}
				<Route element={<ProtectedRoute />}>
					<Route path="/note" element={<HeaderAndSidebar />}>
						
						<Route path=":id" element={<TiptapEditor />} />
					</Route>
				</Route>

				
				
				
				{/* catch all routes */}
				<Route path="*" element={"catch all"} />
				
			</Routes>
		</>
	)
}

export default App
