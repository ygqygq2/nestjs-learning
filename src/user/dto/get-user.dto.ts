export interface GetUserDto {
  page: number;
  limit?: number;
  username?: string;
  role?: number; // select 下拉框
  gender?: number;
}
