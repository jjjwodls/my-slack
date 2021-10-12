import { IDM } from '@typings/db';
import dayjs from 'dayjs';

//날짜별로 메시지를 묶어준다.
export default function makeScrtion(chatList: IDM[]) {
  const sections: { [key: string]: IDM[] } = {};
  chatList?.map((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });

  return sections;
}
