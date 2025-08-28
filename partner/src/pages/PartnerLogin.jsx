import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import apiService from '@/services/apiService';

const PartnerLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        // Redirect if already logged in
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const data = await apiService.login(formData);

            if (data.success) {
                login(data.data.token, data.data.partner);
                toast.success('Login successful!');
                navigate('/');
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">

                    <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-orange-600 to-[#7596DB] bg-clip-text text-transparent">
                        Genuine Nutrition
                    </h2>
                    <h3 className="text-xl font-semibold text-gray-800 mt-2">
                        Partner Portal
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your partner dashboard
                    </p>
                </div>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back</CardTitle>
                        <p className="text-gray-600">Access your partner dashboard</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="mt-2 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                                    <div className="relative mt-2">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter your password"
                                            className="h-12 pr-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1 h-10 w-10 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-[#DE7A3E] to-red-500 hover:from-orange-600 hover:to-[#7596DB] text-white font-semibold shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In to Partner Portal'
                                )}
                            </Button>
                        </form>


                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PartnerLogin;
