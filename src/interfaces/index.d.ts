export interface ICategory {
  id: string;
  title: string;
}
export interface IPost {
  designation?: any;
  property?: any;
  token: any;
  id: string;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  createdAt: string;
  category: ICategory;
}

export interface IUser {  
  id: string;
  first_name: string;
  last_name: string; 
}
