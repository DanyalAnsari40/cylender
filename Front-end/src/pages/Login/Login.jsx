import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { fetchEmployees } from '../../features/EmployeesSlice/Employees';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employees = useSelector((state) => state.employees.list);
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password, role } = form;
    if (
      email === 'admin@example.com' &&
      password === 'admin123' &&
      role === 'admin'
    ) {
      dispatch(login({ user: email, role }));
      navigate('/');
    } else if (role === 'employee') {
      const matchedEmployee = employees.find(
        (emp) => emp.email === email && emp.password === password && emp.role === 'employee'
      );
      if (matchedEmployee) {
        dispatch(login(matchedEmployee));
        navigate('/');
      } else {
        setError('Invalid employee credentials!');
      }
    } else {
      setError('Invalid credentials or role!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-white p-2">
      <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl space-y-6 w-full max-w-xs sm:max-w-sm border border-blue-100 mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">Login</h2>
        <p className="text-center text-gray-500 mb-4">Sign in to your account</p>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          label="Email"
          placeholder="Email"
          required
        />
        <Input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          label="Password"
          placeholder="Password"
          required
        />
        <div>
          <label className="block mb-1 font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        {error && <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-xl py-2">{error}</p>}
        <Button type="submit" fullWidth loading={loading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
