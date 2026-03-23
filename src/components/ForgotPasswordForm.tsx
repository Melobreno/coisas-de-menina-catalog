import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSubmitting(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl text-foreground mb-2">E-mail Enviado!</h2>
        <p className="font-body text-sm text-muted-foreground mb-6">
          Se uma conta existir com o e-mail <strong>{email}</strong>, você receberá um link para redefinir sua senha.
        </p>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-6">
        <Mail className="w-10 h-10 text-gold mx-auto mb-3" />
        <h2 className="font-display text-2xl text-foreground">Recuperar Senha</h2>
        <p className="font-body text-sm text-muted-foreground mt-2">
          Informe seu e-mail para receber um link de recuperação
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="reset-email" className="font-body text-sm">E-mail</Label>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="mt-1"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive font-body">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          Enviar Link de Recuperação
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onBack}
          className="font-body text-sm text-gold hover:underline"
        >
          <ArrowLeft className="w-3 h-3 inline mr-1" />
          Voltar ao login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
