import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import GlassContainer from '../components/GlassContainer';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginPage = ({ onBack }) => {
  const [submitState, setSubmitState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(() => Boolean(window.google?.accounts?.id));

  const handleCredentialResponse = useCallback(async (response) => {
    if (!response?.credential) {
      setErrorMessage('No se recibió el token de Google. Intenta nuevamente.');
      return;
    }

    setSubmitState('submitting');
    setErrorMessage('');

    try {
      const loginResponse = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'GOOGLE',
          token: response.credential,
        }),
      });

      // Leer el contenido de la respuesta de forma segura
      let data = null;
      const contentType = loginResponse.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const text = await loginResponse.text();
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('Error parsing JSON response:', text, parseError);
          }
        }
      }

      // Verificar el estado de la respuesta después de parsear
      if (!loginResponse.ok) {
        const errorMessage = data?.detail || data?.message || `Error HTTP ${loginResponse.status}`;
        throw new Error(errorMessage);
      }

      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    }
  }, []);

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    if (window.google?.accounts?.id) {
      return;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
      return;
    }

    existingScript.addEventListener('load', () => setScriptLoaded(true), { once: true });
    return;
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !googleClientId) {
      return;
    }

    if (!window.google?.accounts?.id) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleCredentialResponse,
      ux_mode: 'popup',
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
      }
    );

    window.google.accounts.id.prompt();
  }, [scriptLoaded, handleCredentialResponse]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-10 bg-[#F4F0EA] selection:bg-brand-bronze/20 selection:text-brand-dark">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-medium text-brand-dark/75 hover:text-brand-dark transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="w-full max-w-3xl">
        <GlassContainer className="p-8 md:p-12 border-white/50 shadow-2xl">
          <div className="flex flex-col gap-4 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A1D20]/95 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white shadow-sm shadow-brand-charcoal/20">
              Acceso seguro
            </div>
            <h1 className="font-serif italic text-4xl text-brand-dark leading-tight">
              Inicia sesión con Google
            </h1>
            <p className="font-sans text-sm text-brand-dark/70 leading-relaxed max-w-2xl mx-auto">
              Esta aplicación solo admite inicio de sesión a través de Google. Usa tu cuenta para ingresar a tu experiencia personal de DressMe y sincronizar tu perfil con el backend.
            </p>
          </div>

          <div className="mt-10 grid gap-6">
            <div className="rounded-3xl border border-brand-sand/60 bg-[#FAF8F5]/95 p-6 flex flex-col items-center justify-center gap-4">
              <div id="google-signin-button" className="w-full min-h-[52px]" />

              {!googleClientId && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  No se encontró un cliente de Google configurado. Añade <span className="font-semibold">VITE_GOOGLE_CLIENT_ID</span> a tu frontend y reinicia el servidor.
                </div>
              )}

              {submitState === 'submitting' && (
                <div className="inline-flex items-center gap-2 text-brand-dark/80 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Autenticando...
                </div>
              )}

              {submitState === 'success' && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  Inicio de sesión completado. Ya estás conectado con el backend.
                </div>
              )}

              {submitState === 'error' && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <div className="inline-flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4" /> Error
                  </div>
                  <p className="mt-2">{errorMessage}</p>
                </div>
              )}
            </div>

          </div>
        </GlassContainer>
      </div>
    </div>
  );
};

export default LoginPage;
