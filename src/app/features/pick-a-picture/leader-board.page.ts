import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SupabaseApiService } from '../../core/supabase-api.service';
import { Database } from '../../types/supabase';
import { from, map, take, tap } from 'rxjs';
import { TabViewModule } from 'primeng/tabview';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-leader-board-page',
    standalone: true,
    imports: [
    CommonModule,
    TabViewModule,
    ButtonModule,
    RouterModule
    ],
    template: `
 <div
        class="h-page min-h-page max-h-page min-h-page w-screen flex flex-col items-center justify-start overflow-y-auto gap-4 p-4"
      >
      <div class="text-2xl">Classement</div>

      <p-button label="Accueil" [routerLink]="['']"></p-button>


      <div class="block max-w-screen w-screen overflow-x-auto">
      <p-tabView [activeIndex]="roundIndex()" (activeIndexChange)="indexChange($event)" >
            <p-tabPanel header="Total"/>
            <p-tabPanel header="Round 1"/>
            <p-tabPanel header="Round 2"/>
            <p-tabPanel header="Round 3"/>
            <p-tabPanel header="Round 4"/>
            <p-tabPanel header="Round 5"/>
        </p-tabView>
      </div>


      @for (score of scoresToDisplay(); track score.userName; let index = $index) {
      <div>
        n°{{index + 1 }} {{ score.userName }} - {{ score.score }}
      </div>
      }
 </div>

    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LeaderBoardPage {
    private readonly supabaseApiService = inject(SupabaseApiService);
    protected leaderBoardByRound$ = from(this.supabaseApiService.getLeaderBoard() as unknown as Promise<{data: (Database['public']['Tables']['leader-board']['Row']&{total: number})[]}>).pipe(
        take(1),
        map(result => result.data),
        map(data => data.map((row) => {
            return ({
            ...row,
            total: ((row.round1 ?? 0) + (row.round2 ?? 0) + (row.round3 ?? 0) + (row.round4 ?? 0) + (row.round5 ?? 0)),
        })}).sort((a, b) => b.total - a.total)
    ),
        tap(data => console.log(data))
    );

    leaderBoardByRound = toSignal(this.leaderBoardByRound$);

    roundIndex = signal<0|1|2|3|4|5>(0);

    roundToDisplay = computed(() => {
        const roundIndex = this.roundIndex() ;
        if(roundIndex === 0) {
            return 'total' as const;
        }

        return `round${roundIndex}` as const;
    });

    scoresToDisplay = computed(() => {
        const leaderBoard = this.leaderBoardByRound();
        if(!leaderBoard) {
            return [];
        }
        const roundToDisplay = this.roundToDisplay();
        return leaderBoard.map((row) => ({
            userName: row.userName,
            score: row[roundToDisplay] ?? 0
        })).sort((a, b) => b.score - a.score);
    });

    indexChange(index: number) {
        this.roundIndex.set(index as 0|1|2|3|4|5);
    }
}