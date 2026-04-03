import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function LoginError() {
    return (
        <div className="bg-surface min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-error/20 blur-3xl rounded-full"></div>
                    <span className="material-symbols-outlined text-8xl text-error relative z-10 animate-pulse">
                        gpp_bad
                    </span>
                </div>
                
                <h1 className="text-4xl font-headline font-bold text-on-surface mb-4 tracking-tight">
                    Synchronization Failed
                </h1>
                
                <p className="text-on-surface-variant font-body mb-10 leading-relaxed">
                    We encountered an error while attempting to establish a secure link with the Identity Server. 
                    This could be due to an expired session, invalid credentials, or a temporary communication breach.
                </p>

                <div className="flex flex-col gap-4">
                    <Link to="/">
                        <Button variant="primary" className="w-full py-6">
                            Retry Authentication
                        </Button>
                    </Link>
                    
                    <Link to="/contact" className="text-sm font-label uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                        Contact System Administrator
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                    <p className="text-[10px] font-label uppercase tracking-[0.3em] text-on-surface-variant/40">
                        Error Code: ERR_AUTH_CALLBACK_FAILURE
                    </p>
                </div>
            </div>
        </div>
    );
}
