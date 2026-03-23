import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus, Loader2, ShieldAlert } from "lucide-react";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60; // seconds

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { error } = isLogin 
      ? await signIn(email, password)
      : await signUp(email, password);

    setIsSubmitting(false);

    if (error) {
      setError(error.message);
    } else {
      onSuccess?.();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl text-foreground">
          {isLogin ? "Acesso Administrativo" : "Criar Conta"}
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-2">
          {isLogin 
            ? "Entre com suas credenciais para gerenciar o catálogo"
            : "Crie uma conta para acessar o painel"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="font-body text-sm">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password" className="font-body text-sm">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="mt-1"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive font-body">{error}</p>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : isLogin ? (
            <LogIn className="w-4 h-4 mr-2" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          {isLogin ? "Entrar" : "Criar Conta"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="font-body text-sm text-gold hover:underline"
        >
          {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
