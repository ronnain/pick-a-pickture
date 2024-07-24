import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { Database } from '../types/supabase';


export type PickPicture = {
  id: number;
  thumbnailImageSrc: string;
  imageSrc: string;
  isSelectedByTheUser: boolean;
  isSelectedByTheMainUser: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class SupabaseApiService {
  private supabase = createClient<Database>(
    'https://sxbabjgpugvtcnxhpilr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YmFiamdwdWd2dGNueGhwaWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2MjUxNjAsImV4cCI6MjAzNzIwMTE2MH0.9M78rD-BI7J2L2Rzn84NObDyKUTiGm0tOX10zzJv0os'
  );

  public getImageToPicked(round: number) {
    if(round === 1) {
      return this.supabase
        .from('image-pick-by-round')
        .select(`id, isSelectedByTheMainUser:round${round}`)
        .order('id');
    }
    return this.supabase
      .from('image-pick-by-round')
      .select(`id, isSelectedByTheMainUser:round${round}`)
      .eq(`round${round-1}`, true)
      .order('id');
  }

  public getAllImage(roud: number) {
    return this.supabase
      .from('image-pick-by-round')
      .select(`id`)
      .order('id');
  }

  public storeImagePicked(round: number, id: number[]) {
    return this.supabase
      .from('image-pick-by-round')
      .update({ [`round${round}`]: true })
      .in('id', id);
  }

  public storeUserScore(round: number, userName: string, score: number) {
    return this.supabase
      .from('leader-board')
      .upsert({
        userName,
        [`round${round}`]: score,
      });
  }

  public getLeaderBoard() {
    return this.supabase
      .from('leader-board')
      .select('*');
  }
}
