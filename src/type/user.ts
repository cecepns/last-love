export interface User {
	id?: string;
	audioUrl: string;
	email: string;
	identity: string[];
	images: string[];
	isPaid: boolean;
	isVerified: boolean | string; // Assuming it can be a boolean or string
	name: string;
	openQuestionCompleted: boolean;
	partnerVideo: string;
	questionCompleted: boolean;
	questionsCurrentIndex?: number; // Optional, as it's not present in all objects
	uid: string;
	videoThumbnail: string;
}

export interface UserNotif {
	value: string;
	label: string;
}

export interface UserResponseNotif {
	users: UserNotif[];
  }

export interface UserResponse {
  users: User[];
  totalPages: number;
  totalUsers: number;
}

export interface UserDetailResponse {
  user: User;
}

