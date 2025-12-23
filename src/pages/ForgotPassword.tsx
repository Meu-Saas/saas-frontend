import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { authAPI } from '../services/api';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError('Erro ao enviar email de recuperacao. Verifique se o email esta correto.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Email Enviado</CardTitle>
            <CardDescription className="text-sm">
              Verifique sua caixa de entrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Se o email informado estiver cadastrado, voce recebera um link para redefinir sua senha.
            </p>
            <Link to="/login">
              <Button className="w-full">Voltar para Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Esqueci minha senha</CardTitle>
          <CardDescription className="text-sm">
            Informe seu email para receber um link de recuperacao
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Link de Recuperacao'}
            </Button>
            <div className="text-sm text-center">
              <Link to="/login" className="text-blue-600 hover:underline">
                Voltar para Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
