export const INSTAGRAM_POSTS = {
  public: [
    {
      id: 1,
      caption: "Check out this amazing moment",
      image: "https://www.instagram.com/reel/DM5iWVYIdZm/?utm_source=ig_web_copy_link",
      likes: 1240,
      comments: 45,
      date: "2024-12-10",
      link: "https://www.instagram.com/reel/DM5iWVYIdZm/"
    },
    {
      id: 2,
      caption: "Beautiful shot",
      image: "https://www.instagram.com/reel/DN8kzMpDHeL/?utm_source=ig_web_copy_link",
      likes: 892,
      comments: 32,
      date: "2024-12-08",
      link: "https://www.instagram.com/reel/DN8kzMpDHeL/"
    },
    {
      id: 3,
      caption: "Epic adventure",
      image: "https://www.instagram.com/reel/DNYGIoxshl2/?utm_source=ig_web_copy_link",
      likes: 654,
      comments: 28,
      date: "2024-12-05",
      link: "https://www.instagram.com/reel/DNYGIoxshl2/"
    },
    {
      id: 4,
      caption: "Amazing vibes",
      image: "https://www.instagram.com/reel/DNTfHgHMraY/?utm_source=ig_web_copy_link",
      likes: 512,
      comments: 21,
      date: "2024-12-02",
      link: "https://www.instagram.com/reel/DNTfHgHMraY/"
    }
  ],
  private: [
    {
      id: 1,
      caption: "Personal moment with loved ones",
      image: "https://via.placeholder.com/300x300?text=Personal+1",
      likes: 342,
      comments: 12,
      date: "2024-12-09",
      link: "https://instagram.com"
    },
    {
      id: 2,
      caption: "Behind the scenes of my creative process",
      image: "https://via.placeholder.com/300x300?text=Behind+Scenes",
      likes: 256,
      comments: 18,
      date: "2024-12-06",
      link: "https://instagram.com"
    },
    {
      id: 3,
      caption: "Casual everyday moments",
      image: "https://via.placeholder.com/300x300?text=Everyday",
      likes: 198,
      comments: 15,
      date: "2024-12-02",
      link: "https://instagram.com"
    }
  ]
};

export const getPublicPosts = () => INSTAGRAM_POSTS.public;
export const getPrivatePosts = () => INSTAGRAM_POSTS.private;
