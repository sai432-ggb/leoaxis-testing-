import React from 'react';
import './LoadingSpinner.css';
const LoadingSpinner = ({ fullScreen = false, size = 'md', message }) => {
if (fullScreen) {
return (
<div className="loading-overlay">
<div className="loading-content">
<div className={`loading-spinner loading-${size}`}>
<div></div><div></div><div></div><div></div>
</div>
{message && <p className="loading-message">{message}</p>}
</div>
</div>
);
}
return (
<div className="loading-inline">
<div className={`loading-spinner loading-${size}`}>
<div></div><div></div><div></div><div></div>
</div>
{message && <p className="loading-message">{message}</p>}
</div>
);
};
export default LoadingSpinner;