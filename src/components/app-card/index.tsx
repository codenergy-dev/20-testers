interface AppCardProps {
  app: App
}

export function AppCard({app}: AppCardProps) {
  return (
    <div 
      key={app.packageName}
      className="!block card h-96 bg-base-100 shadow-xl overflow-hidden bg-no-repeat bg-center bg-cover" 
      style={{backgroundImage: `url(${app.screenshots?.[0]})`}}
    >
      <div className="w-full h-full card-body p-6 bg-gradient-to-b from-transparent to-slate-700">
        <div className="flex-1"></div>
        <p className="max-h-12 font-bold text-white text-ellipsis overflow-hidden">
        {app.description}
        </p>
        <div className="card-actions">
          <figure><img className="w-12 h-12 rounded-xl" src={app.icon} /></figure>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-bold text-white text-ellipsis overflow-hidden whitespace-nowrap">
              {app.applicationName}
            </span>
            <a href={`/app/${app.id}`} className="w-16 btn btn-outline border-white text-white hover:border-white hover:text-slate-700 hover:bg-white btn-xs">
              View
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}