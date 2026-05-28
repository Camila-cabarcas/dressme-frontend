import { CheckCircle, LogOut, RotateCcw } from 'lucide-react';

const HomePage = ({ user, onLogout, onGoToOnboarding }) => {
  return (
    <div className="min-h-screen bg-[#F4F0EA] flex items-center justify-center px-6 py-10">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-black/5">
        {user?.profilePicture && (
          <img
            src={user.profilePicture}
            alt={user.displayName}
            className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-emerald-100 object-cover"
          />
        )}

        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
        </div>

        <h1 className="text-4xl font-serif italic text-brand-dark mb-4">
          Ya estás calibrado 🎯
        </h1>

        <p className="text-brand-dark/70 leading-relaxed mb-8">
          Tu perfil ya fue calibrado correctamente. No necesitas volver al onboarding a menos que quieras revalidarlo.
        </p>

        <div className="rounded-2xl bg-[#F4F0EA] p-4 mb-8">
          <p className="text-sm text-brand-dark/60">
            Sesión activa para:
          </p>
          <p className="font-semibold text-brand-dark mt-1">
            {user?.displayName || 'Usuario'}
          </p>
          <p className="text-sm text-brand-dark/50">
            {user?.email || ''}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onGoToOnboarding}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-brand-dark/15 text-brand-dark hover:bg-brand-dark hover:text-white transition"
          >     
            <RotateCcw className="w-4 h-4" />
            Reabrir onboarding
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-dark text-white hover:opacity-90 transition"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;