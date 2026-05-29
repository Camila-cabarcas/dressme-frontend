import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Edit3, Loader2, LogOut, Sparkles } from 'lucide-react';
import GlassContainer from '../components/GlassContainer';

const defaultAnalysis = {
  color: 'Charcoal Grey',
  type: 'Jacket / Blazer',
  category: 'Outerwear',
  style: 'Urban Chic',
};

const loadingSteps = [
  'Identificando color...',
  'Determinando categoría...',
  'Analizando estilo...',
];

const ProcessingValidationPage = ({
  user,
  imageUrl,
  analysis = defaultAnalysis,
  isLoading = true,
  onConfirm,
  onLogout,
  onEditAttributes,
  onReturnToUpload,
}) => {
  const [sessionUser, setSessionUser] = useState(user);
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(analysis);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const rawUser = localStorage.getItem('dressme_user');
    if (!rawUser || !localStorage.getItem('authToken')) {
      window.location.href = '/login';
      return;
    }

    if (!sessionUser) {
      setSessionUser(JSON.parse(rawUser));
    }
  }, [sessionUser]);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentStep((value) => (value + 1) % loadingSteps.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    setFormData(analysis);
  }, [analysis]);

  const currentSubtitle = useMemo(() => loadingSteps[currentStep], [currentStep]);

  const handleFieldChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleConfirm = () => {
    setSavedMessage('La prenda quedó guardada con éxito. Redireccionando...');
    setTimeout(() => {
      if (onConfirm) {
        onConfirm(formData);
      }
      if (onReturnToUpload) {
        onReturnToUpload();
      }
    }, 1200);
  };

  const imageSrc = imageUrl || '/assets/wardrobe_placeholder.png';

  return (
    <div className="min-h-screen relative bg-[#F4F0EA] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url('/assets/wardrobe_bg.png')`,
          filter: 'blur(12px)',
        }}
      />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[12px]" />

      <div className="relative z-10 min-h-screen flex flex-col px-4 py-8 md:px-10">
        <header className="flex items-center justify-between mb-8">
          <div className="font-serif italic text-2xl text-brand-dark tracking-wide select-none">
            DressMe
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-dark shadow-sm backdrop-blur"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </header>

        {isLoading ? (
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-[32px] border border-white/30 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
            <div className="relative mb-10 flex h-44 w-44 items-center justify-center rounded-full border-4 border-brand-bronze/30 bg-white/20 shadow-lg shadow-brand-dark/10">
              <div className="absolute inset-0 rounded-full border border-white/50" />
              <div className="absolute inset-4 rounded-full border-2 border-brand-dark/10" />
              <div className="flex h-full w-full items-center justify-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-dark/95 text-white shadow-xl shadow-brand-dark/20">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-brand-bronze/70" />
            </div>

            <div className="text-center max-w-xl">
              <h1 className="text-3xl font-serif italic text-brand-dark mb-4">
                Nuestra IA está analizando tu prenda...
              </h1>
              <p className="text-base text-brand-dark/70">{currentSubtitle}</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <GlassContainer className="overflow-hidden rounded-[28px] bg-white/20 p-6 shadow-2xl shadow-brand-dark/10 backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[20px] border border-white/40 bg-white/20 shadow-lg shadow-brand-dark/10">
                <img
                  src={imageSrc}
                  alt="Prenda subida"
                  className="h-full min-h-[340px] w-full object-cover"
                />
              </div>
            </GlassContainer>

            <GlassContainer className="rounded-[28px] bg-white/15 p-8 shadow-2xl shadow-brand-dark/10 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-bronze">Resultados de Análisis IA</p>
                  <h2 className="mt-3 text-3xl font-serif italic text-brand-dark">
                    Validación de prenda
                  </h2>
                </div>
                <Sparkles className="w-10 h-10 text-brand-bronze" />
              </div>

              <p className="mb-8 text-sm leading-7 text-brand-dark/75">
                Revisa los atributos detectados por la IA. Si algo no coincide, puedes editar los campos antes de confirmar el guardado.
              </p>

              <div className="space-y-4">
                {['type', 'category', 'style', 'color'].map((field) => (
                  <div
                    key={field}
                    className="flex flex-col gap-3 rounded-3xl border border-white/40 bg-white/40 p-4 backdrop-blur"
                  >
                    <span className="text-xs uppercase tracking-[0.24em] text-brand-dark/50">
                      {field === 'type' ? 'Tipo de Prenda' : field === 'category' ? 'Categoría' : field === 'style' ? 'Estilo' : 'Color'}
                    </span>
                    {isEditing ? (
                      <input
                        value={formData[field]}
                        onChange={handleFieldChange(field)}
                        className="w-full rounded-2xl border border-brand-dark/10 bg-white/80 px-4 py-3 text-base text-brand-dark outline-none transition focus:border-brand-bronze"
                      />
                    ) : (
                      <p className="text-xl font-semibold text-brand-dark">{formData[field]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-brand-dark px-6 py-4 text-base font-semibold text-white shadow-xl shadow-brand-dark/20 transition hover:bg-brand-dark/90"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  ¡Todo es correcto! →
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing((prev) => !prev);
                    if (onEditAttributes) {
                      onEditAttributes(!isEditing);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/30 px-6 py-4 text-base font-semibold text-brand-dark transition hover:bg-white/50"
                >
                  <Edit3 className="w-5 h-5" />
                  ✏️ Editar atributos
                </button>
              </div>

              {savedMessage ? (
                <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-900">
                  {savedMessage}
                </div>
              ) : null}
            </GlassContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingValidationPage;
