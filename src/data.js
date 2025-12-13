export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Split, Croatia",
    imgur: "6hdtAdU",
    exif: "1/15sec, 28mm, ISO 5000, f/3.8"
  },
  {
    id: 2,
    title: "Masna Luka, Bosnia and Herzegovina",
    imgur: "vTTmPfV",
    exif: "1/500sec, 35mm, ISO 100, f/3.2"
  },
  {
    id: 3,
    title: "Zavidovici, Bosnia and Herzegovina",
    imgur: "zgK4DEF",
    exif: "1/500sec, 66mm, ISO 160, f/5.3, Image Stack"
  },
  {
    id: 4,
    title: "Mostar, Bosnia and Herzegovina",
    imgur: "JvS2P7B",
    exif: "1/5sec, 80mm, ISO 500, f/5"
  },
  {
    id: 5,
    title: "Livno, Bosnia and Herzegovina",
    imgur: "kYW6kgy",
    exif: "1/80sec, 58mm, ISO 100, f/10"
  },
  {
    id: 6,
    title: "Mostar, Bosnia and Herzegovina",
    imgur: "mBxwKhF",
    exif: "1/1600sec, 27mm, ISO 250, f/6.3"
  },
  {
    id: 7,
    title: "Kastel Gomilica, Croatia",
    imgur: "K82wqoq",
    exif: "1/1250sec, 52mm, ISO 125, f/4.8"
  },
  {
    id: 8,
    title: "Zavidovici, Bosnia and Herzegovina",
    imgur: "DATUvnU",
    exif: "1/125sec, 120mm, ISO 160, f/5.6"
  },
  {
    id: 9,
    title: "Mostar, Bosnia and Herzegovina",
    imgur: "kkOsCkO",
    exif: "1/3200sec, 65mm, ISO 400, f/5.6"
  },
  {
    id: 10,
    title: "Livno, Bosnia and Herzegovina",
    imgur: "LKXvWgn",
    exif: "1/2000sec, 50mm, ISO 100, f/4.0"
  },
  {
    id: 11,
    title: "Split, Croatia",
    imgur: "lIpGLUf",
    exif: "1/100sec, 85mm, ISO 800, f/1.8"
  },
  {
    id: 12,
    title: "Diocletian's Palace, Split, Croatia",
    imgur: "Ohk85GO",
    exif: "1/60sec, 35mm, ISO 1600, f/2"
  }
];

// Sirv Image Optimization helper
const sirvTransform = (imgur, options) => {
  const params = new URLSearchParams(options);
  return `https://aldjan.sirv.com/Website%20Images/${imgur}.jpeg?${params.toString()}`;
};

export const getThumbUrl = (imgur) => {
  return sirvTransform(imgur, { w: 1280, q: 80 });
};

export const getLightboxUrl = (imgur) => {
  return sirvTransform(imgur, { w: 1200, q: 80 });
};

export const getThumbSrcSet = (imgur) => {
  const thumb320 = sirvTransform(imgur, { w: 320, q: 80 });
  const thumb640 = sirvTransform(imgur, { w: 640, q: 80 });
  const thumb1280 = sirvTransform(imgur, { w: 1280, q: 80 });
  return `${thumb320} 320w, ${thumb640} 640w, ${thumb1280} 1280w`;
};

export const getLightboxSrcSet = (imgur) => {
  const light800 = sirvTransform(imgur, { w: 800, q: 80 });
  const light1200 = sirvTransform(imgur, { w: 1200, q: 80 });
  return `${light800} 800w, ${light1200} 1200w`;
};

export const getPlaceholderUrl = (imgur) => {
  return sirvTransform(imgur, { w: 20, h: 15, q: 50 });
};
