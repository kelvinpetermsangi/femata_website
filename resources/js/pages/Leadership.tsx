import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

export default function Leadership({
  leaders,
  announcements,
}: {
  leaders: {
    id: number;
    name: string;
    title: string;
    bio?: string | null;
    photo_path?: string | null;
  }[];
  announcements?: [];
}) {
  return (
    <>
      <Head title="Leadership" />

      <PublicLayout announcements={announcements}>
        <section className="section-shell">
          <div className="container-shell">
            <div className="heritage-hero overflow-hidden rounded-[2rem] border border-[rgb(var(--border))] p-6 sm:p-10">
              <h1 className="section-title">Leadership & Management</h1>
              <p className="section-copy">
                FEMATA is steered by a committed board and executive council with deep institutional
                knowledge.
              </p>
            </div>
          </div>
        </section>
        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {leaders.length === 0 ? (
                <div className="card-shell p-6 text-sm text-[rgb(var(--muted))]">
                  Leaders will be published soon.
                </div>
              ) : (
                leaders.map((leader) => (
                  <article key={leader.id} className="card-shell p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[rgb(var(--surface-2))] sm:h-20 sm:w-20">
                        {leader.photo_path ? (
                          <img
                            src={leader.photo_path}
                            alt={leader.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-[rgb(var(--primary))]">{leader.name}</h3>
                        <p className="text-sm text-[rgb(var(--muted))]">{leader.title}</p>
                      </div>
                    </div>

                    {leader.bio ? (
                      <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted))]">{leader.bio}</p>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
