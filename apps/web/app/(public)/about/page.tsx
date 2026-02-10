import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="p-4 text-white">
            <header className="flex justify-between items-center w-full mt-4">
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">About Uptor</h3>
                    <blockquote className="mt-6 border-l-2 pl-6 italic">
                        Uptime monitoring, performance visibility, and fast incident response for modern teams.
                    </blockquote>
                </div>

                <Image src="/streetlights.png" alt="Streetlights" width={48} height={12} />
            </header>

            <div className="pt-6 overflow-y-auto no-scrollbar space-y-6">
                <section className="glass-card rounded-3xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">What is Uptor?</h4>
                    <p className="text-sm text-slate-300">
                        Uptor is a B2B uptime monitoring and website performance platform. It continuously checks your
                        endpoints, tracks latency, and surfaces incidents so engineering and operations teams can act
                        quickly when service health changes.
                    </p>
                </section>

                <section className="glass-card rounded-3xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">How Uptor Works</h4>
                    <ol className="list-decimal list-inside text-sm text-slate-300 space-y-2">
                        <li>Create monitors for your critical endpoints and APIs.</li>
                        <li>Background workers perform scheduled checks on each monitor.</li>
                        <li>Uptor records response time, status code, and availability signals.</li>
                        <li>Alerts are generated when downtime or recovery events occur.</li>
                        <li>Dashboards summarize availability trends and incident history.</li>
                    </ol>
                </section>

                <section className="glass-card rounded-3xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">What You Can Track</h4>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
                        <li>Websites, APIs, and internal services.</li>
                        <li>Response time, uptime, and latency trends.</li>
                        <li>Downtime and recovery notifications.</li>
                        <li>Plan usage and monitor limits.</li>
                    </ul>
                </section>

                <section className="glass-card rounded-3xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Built for Operations</h4>
                    <p className="text-sm text-slate-300">
                        Uptor is designed for reliability teams who need clear signals and fast feedback loops. It keeps
                        monitoring data accessible, highlights what needs attention, and helps prevent incident surprises.
                    </p>
                </section>
            </div>
        </div>
    );

}
