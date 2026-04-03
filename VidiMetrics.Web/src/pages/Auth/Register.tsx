import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useRegisterMutation } from '@/store/apis/identityApi'

const registerSchema = z.object({
  firstName: z.string().min(2, 'Identity tag must be at least 2 characters'),
  lastName: z.string().min(2, 'Secondary tag must be at least 2 characters'),
  email: z.string().email('Invalid terminal ID format'),
  password: z.string().min(8, 'Encryption key must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Encryption keys don't match",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const [registerUser, { isLoading }] = useRegisterMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data).unwrap()
      toast.success('Registration Initiated', {
        description: 'Identity established. Redirecting to secure login...',
      })
      
      // Delay slightly for toast to be seen, then hard redirect to Identity Server login
      setTimeout(() => {
        window.location.href = `${import.meta.env.VITE_IDENTITY_SERVER_URL}/login`;
      }, 1500);

    } catch (err: any) {
      if (err.data?.errors) {
        // Handle ASP.NET ProblemDetails or our custom standardized errors
        const serverErrors = err.data.errors as Record<string, string[]>
        
        Object.entries(serverErrors).forEach(([field, messages]) => {
          // Normalize field name to camelCase (e.g. "Password" -> "password")
          const fieldName = (field.charAt(0).toLowerCase() + field.slice(1)) as keyof RegisterFormValues
          
          setError(fieldName, {
            type: 'server',
            message: messages[0], // Show the first validation error for this field
          })
        })

        toast.error('Validation Error', {
          description: err.data.title || 'Please correct the highlighted errors.',
        })
      } else {
        toast.error('Registration Failed', {
          description: err.data?.description || 'System failure during identity creation.',
        })
      }
    }
  }

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="hidden lg:block space-y-8">
        <div className="space-y-4">
          <span className="text-secondary font-label text-xs tracking-[0.3em] uppercase">The Cinematic Observer</span>
          <h1 className="font-headline text-6xl font-bold leading-tight tracking-tighter">
            Enter the <br />
            <span className="text-gradient-primary">Cinematic Engine</span>
          </h1>
        </div>
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
          Transforming raw metrics into visual narratives. Join the elite network of data storytellers and witness your analytics evolve into a cinematic experience.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span className="material-symbols-outlined text-primary mb-2">auto_awesome</span>
            <div className="text-sm font-semibold text-on-surface">Neural Insights</div>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span className="material-symbols-outlined text-secondary mb-2">videocam</span>
            <div className="text-sm font-semibold text-on-surface">Director Mode</div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-8 lg:p-12 border border-outline-variant/20 relative overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant ml-1">Identity Tag</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">person</span>
                <input 
                  {...register('firstName')}
                  className={`w-full bg-surface-container-lowest/50 border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-secondary/20 transition-all font-body text-sm ${errors.firstName ? 'ring-2 ring-error/50' : ''}`} 
                  placeholder="ALEXANDER" 
                  type="text" 
                  disabled={isLoading}
                />
              </div>
              {errors.firstName && <p className="text-error text-[10px] uppercase ml-1">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant ml-1">Secondary Tag</label>
              <div className="relative">
                <input 
                  {...register('lastName')}
                  className={`w-full bg-surface-container-lowest/50 border-none rounded-lg py-4 px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-secondary/20 transition-all font-body text-sm ${errors.lastName ? 'ring-2 ring-error/50' : ''}`} 
                  placeholder="VANCE" 
                  type="text" 
                  disabled={isLoading}
                />
              </div>
              {errors.lastName && <p className="text-error text-[10px] uppercase ml-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant ml-1">Universal Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">alternate_email</span>
              <input 
                {...register('email')}
                className={`w-full bg-surface-container-lowest/50 border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-secondary/20 transition-all font-body text-sm ${errors.email ? 'ring-2 ring-error/50' : ''}`} 
                placeholder="vance@vidimetrics.ai" 
                type="email" 
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-error text-[10px] uppercase ml-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant ml-1">Secure Key</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                <input 
                  {...register('password')}
                  className={`w-full bg-surface-container-lowest/50 border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-secondary/20 transition-all font-body text-sm ${errors.password ? 'ring-2 ring-error/50' : ''}`} 
                  placeholder="••••••••••••" 
                  type="password" 
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-error text-[10px] uppercase ml-1">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant ml-1">Verify Key</label>
              <div className="relative">
                <input 
                  {...register('confirmPassword')}
                  className={`w-full bg-surface-container-lowest/50 border-none rounded-lg py-4 px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-secondary/20 transition-all font-body text-sm ${errors.confirmPassword ? 'ring-2 ring-error/50' : ''}`} 
                  placeholder="••••••••••••" 
                  type="password" 
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && <p className="text-error text-[10px] uppercase ml-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button 
            className="w-full py-4 btn-gradient rounded-lg font-bold tracking-widest uppercase text-sm shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Establishing Identity...' : 'Begin Journey'}
          </button>
          <p className="text-center text-sm text-on-surface-variant mt-4">
            Already part of the network? <Link className="text-secondary font-medium hover:text-primary transition-colors" to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
