const StatusCard = ({ title, status, statusText, subtitle, icon }) => {
    const getStatusColor = () => {
      switch (status) {
        case "linked":
          return "bg-green-100 text-green-800 border-green-200"
        case "not-seeded":
          return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "eligible":
          return "bg-blue-100 text-blue-800 border-blue-200"
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }
  
    const getStatusIcon = () => {
      switch (status) {
        case "linked":
          return (
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )
        case "not-seeded":
          return (
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )
        case "eligible":
          return (
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                clipRule="evenodd"
              />
            </svg>
          )
        default:
          return null
      }
    }
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-3">{title}</h3>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}
            >
              {getStatusIcon()}
              <span>{statusText}</span>
            </div>
            {subtitle && <p className="text-xs text-gray-500 mt-3">{subtitle}</p>}
          </div>
        </div>
      </div>
    )
  }
  
  export default StatusCard
  