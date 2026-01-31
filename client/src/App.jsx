import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AnimatedBackground from './components/AnimatedBackground';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const CreateEvent = React.lazy(() => import('./pages/CreateEvent'));
const EventDetails = React.lazy(() => import('./pages/EventDetails'));
const Events = React.lazy(() => import('./pages/Events'));
const Results = React.lazy(() => import('./pages/Results'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Profile = React.lazy(() => import('./pages/Profile'));

function App() {
    return (
        <div className="relative min-h-screen text-white">
            <AnimatedBackground />
            <div className="relative z-10">
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <Dashboard />
                            </React.Suspense>
                        } />
                        <Route path="/create-event" element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <CreateEvent />
                            </React.Suspense>
                        } />
                        <Route path="/events/:id" element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <EventDetails />
                            </React.Suspense>
                        } />

                        <Route path="/events" element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <Events />
                            </React.Suspense>
                        } />
                        <Route path="/results" element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <Results />
                            </React.Suspense>
                        } />
                        <Route path="/contact" element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <Contact />
                            </React.Suspense>
                        } />
                        <Route path="/profile" element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <Profile />
                            </React.Suspense>
                        } />
                    </Routes>
                </Router>
            </div>
        </div>
    );
}

export default App;
