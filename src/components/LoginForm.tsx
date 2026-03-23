import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus, Loader2, ShieldAlert, MailCheck } from "lucide-react";
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
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(`Muitas tentativas. Tente novamente em ${remaining} segundos.`);
      return;
    }

    setIsSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      setIsSubmitting(false);
      if (error) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_DURATION * 1000;
          setLockoutUntil(until);
          setError(`Conta bloqueada temporariamente. Tente novamente em ${LOCKOUT_DURATION} segundos.`);
          setTimeout(() => {
            setFailedAttempts(0);
            setLockoutUntil(null);
          }, LOCKOUT_DURATION * 1000);
        } else {
          setError(error.message);
        }
      } else {
        setFailedAttempts(0);
        setLockoutUntil(null);
        onSuccess?.();
      }
    } else {
      const { error, needsConfirmation } = await signUp(email, password);
      setIsSubmitting(false);
      if (error) {
        setError(error.message);
      } else if (needsConfirmation) {
        setSignupSuccess(true);
      } else {
        onSuccess?.();
      }
    }
  };

  const isLockedOut = lockoutUntil !== null && Date.now() < lockoutUntil;

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  if (signupSuccess) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <MailCheck className="w-12 h-12 text-gold mx-auto mb-4" />
        <h2 className="font-display text-2xl text-foreground mb-2">Verifique seu E-mail</h2>
        <p className="font-body text-sm text-muted-foreground mb-2">
          Enviamos um link de confirmação para:
        </p>
        <p className="font-body text-sm font-semibold text-foreground mb-4">{email}</p>
        <p className="font-body text-xs text-muted-foreground mb-6">
          Clique no link recebido no e-mail para ativar sua conta. Verifique também a pasta de spam.
        </p>
        <button
          type="button"
          onClick={() => { setSignupSuccess(false); setIsLogin(true); }}
          className="font-body text-sm text-gold hover:underline"
        >
          Voltar ao login
        </button>
      </div>
    );
  }

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
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <ShieldAlert className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive font-body">{error}</p>
          </div>
        )}

        {isLockedOut && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-700 font-body">
              Conta temporariamente bloqueada por segurança.
            </p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || isLockedOut}
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

      {isLogin && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="font-body text-xs text-muted-foreground hover:text-gold hover:underline transition-colors"
          >
            Esqueceu sua senha?
          </button>
        </div>
      )}

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
