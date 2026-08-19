import { Info } from "lucide-react"

export default function NoticeBanner() {
    return (
        <>
            <section className="px-6 py-8">
                <div className="mx-auto max-w-7xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
                    <div className="flex items-start gap-4 w-full">
                        <Info className="mt-1 h-6 w-6 text-amber-700" />

                        <div>
                            <h3 className="font-semibold text-amber-900">
                            Portfolio Demonstration
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-700">
                                This fictional SaaS travel recommendation web application showcases a modern website experience
                                built with Next.js, TypeScript, Tailwind CSS, Supabase(Backend), and AI-assisted development. All generated data are mockups for the purposes of project only.
                            </p>

                            <div className="flex flex-col mt-2 text-sm leading-6 text-slate-700">
                                <div>• Responsive Layout</div>
                                <div>• Component-based Architecture</div>
                                <div>• Reusable Cards</div>
                                
                                <div>• API Integrations</div>
                                <div>• Modern Component Animations</div>
                                <div>• Authentication & RBAC Permissions</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}