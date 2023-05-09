const getElapsedtime = (datePast: number) => {
  let elapsed = (Date.now() - datePast) / 1000;

  if (elapsed < 60) {
    if (elapsed >= 2) return `${Math.floor(elapsed)} seconds ago`;
    else return "just now";
  }

  elapsed /= 60;

  if (elapsed < 60) {
    if (elapsed >= 2) return `${Math.floor(elapsed)} minutes ago`;
    else return "1 minute ago";
  }

  elapsed /= 60;

  if (elapsed < 24) {
    if (elapsed >= 2) return `${Math.floor(elapsed)} hours ago`;
    else return "1 hour ago";
  }

  elapsed /= 24;

  if (elapsed < 30) {
    if (elapsed >= 2) return `${Math.floor(elapsed)} days ago`;
    else return "1 day ago";
  }

  elapsed /= 30;

  if (elapsed < 12) {
    if (elapsed >= 2) return `${Math.floor(elapsed)} months ago`;
    else return "1 month ago";
  }

  elapsed /= 12;

  if (elapsed >= 2) return `${Math.floor(elapsed)} years ago`;
  else return "1 year ago";
};

export default getElapsedtime;
