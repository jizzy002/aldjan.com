export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Split Riviera nighttime",
    imgur: "6hdtAdU",
    exif: "1/15sec, 28mm, ISO 5000, f/3.8"
  },
  {
    id: 2,
    title: "Monastery in Masna Luka",
    imgur: "vTTmPfV",
    exif: "1/500sec, 35mm, ISO 100, f/3.2"
  },
  {
    id: 3,
    title: "Duga bridge in Zavidovici",
    imgur: "zgK4DEF",
    exif: "1/500sec, 66mm, ISO 160, f/5.3, Image Stack"
  },
  {
    id: 4,
    title: "Mostar street nightscape",
    imgur: "JvS2P7B",
    exif: "1/5sec, 80mm, ISO 500, f/5"
  },
  {
    id: 5,
    title: "Sunset in Livno",
    imgur: "kYW6kgy",
    exif: "1/80sec, 58mm, ISO 100, f/10"
  },
  {
    id: 6,
    title: "Mostar old bridge",
    imgur: "mBxwKhF",
    exif: "1/1600sec, 27mm, ISO 250, f/6.3"
  },
  {
    id: 7,
    title: "Ships in Kastel marina",
    imgur: "K82wqoq",
    exif: "1/1250sec, 52mm, ISO 125, f/4.8"
  },
  {
    id: 8,
    title: "Zavidovici train station",
    imgur: "DATUvnU",
    exif: "1/125sec, 120mm, ISO 160, f/5.6"
  },
  {
    id: 9,
    title: "Mostar old bridge café/house",
    imgur: "kkOsCkO",
    exif: "1/3200sec, 65mm, ISO 400, f/5.6"
  },
  {
    id: 10,
    title: "Passat CC aesthetic",
    imgur: "LKXvWgn",
    exif: "1/2000sec, 50mm, ISO 100, f/4.0"
  },
  {
    id: 11,
    title: "Split city train station",
    imgur: "lIpGLUf",
    exif: "1/100sec, 85mm, ISO 800, f/1.8"
  },
  {
    id: 12,
    title: "Diocletian's Palace at night",
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
  return sirvTransform(imgur, { w: 400, h: 300, q: 70 });
};

export const getLightboxUrl = (imgur) => {
  return sirvTransform(imgur, { w: 1200, q: 80 });
};

export const getThumbSrcSet = (imgur) => {
  const thumb180 = sirvTransform(imgur, { w: 180, h: 135, q: 70 });
  const thumb400 = sirvTransform(imgur, { w: 400, h: 300, q: 70 });
  return `${thumb180} 180w, ${thumb400} 400w`;
};

export const getLightboxSrcSet = (imgur) => {
  const light800 = sirvTransform(imgur, { w: 800, q: 80 });
  const light1200 = sirvTransform(imgur, { w: 1200, q: 80 });
  return `${light800} 800w, ${light1200} 1200w`;
};

export const getPlaceholderUrl = (imgur) => {
  return sirvTransform(imgur, { w: 20, h: 15, q: 50 });
};
