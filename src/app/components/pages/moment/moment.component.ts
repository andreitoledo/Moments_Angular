import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MomentService } from 'src/app/service/moment.service';
import { Moment } from 'src/app/Moment';
import { Comment } from 'src/app/Comment';
import { CommentService } from 'src/app/service/comment.service';
import { environment } from 'src/environments/environment';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.css']
})
export class MomentComponent implements OnInit {
  moment?: Moment;
  baseApiUrl = environment.baseApiUrl;

  faTimes = faTimes;
  faEdit = faEdit;

  commentForm!: FormGroup;

  constructor(private momentService: MomentService,
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private router: Router,
    private commentService: CommentService) { }

  ngOnInit(): void {
    const id=Number(this.route.snapshot.paramMap.get('id'));

    this.momentService.getMoment(id)
    .subscribe((item) => (this.moment = item.data));

    this.commentForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
    });
  }

  get text() {
    return this.commentForm.get('text')!;
  }

  get username() {
    return this.commentForm.get('username')!;
  }

  async removeHandler(id: number) {
     if (id) {
       await this.momentService.removeMoment(id).subscribe();

       this.messagesService.add(`Momento excluído com sucesso!`);

       this.router.navigate(['/']);
     }
  }

  async onSubmit(formDirective: FormGroupDirective) {
    if (this.commentForm.invalid) {
      return;
    }
    const data: Comment = this.commentForm.value;

    data.momentId = Number(this.moment!.id);

    await this.commentService
      .createComment(data)
      .subscribe((comment) => this.moment!.comments!.push(comment.data));

    this.messagesService.add(`Comentário adicionado!`);

    this.commentForm.reset();

    formDirective.resetForm();

  }
}
