// lib/storyline-data.ts
// Cốt truyện chương hồi tiên hiệp kinh điển & Hệ thống lựa chọn phân nhánh

import { StorylineChapter, StorylineQuest, StorylineState } from '@/lib/types';

export const STORYLINE_CHAPTERS: StorylineChapter[] = [
  // =========================================================================
  // CHƯƠNG I: THIẾU NIÊN SƠN THÔN (Phàm Nhân -> Luyện Khí Tầng 1)
  // =========================================================================
  {
    id: 'chap_1',
    chapterNumber: 1,
    title: 'Chương I: Thiếu Niên Sơn Thôn',
    description: 'Từ một phàm nhân áo vải nơi bờ suối Thanh Khê, tình cờ nhặt được Cổ Ngọc viễn cổ, mở ra tiên lộ gập ghềnh.',
    recommendedRealm: 'Phàm Nhân -> Luyện Khí Tầng 1',
    bannerColor: 'from-amber-900/60 via-amber-800/40 to-black/80',
    quests: [
      {
        id: 'quest_1_1',
        chapterId: 'chap_1',
        title: 'Hồi 1: Dị Biến Khe Suối',
        realmRequirement: 0,
        prologue: 'Núi Thanh Lam bốn bề mây mù bao phủ, tiếng suối Thanh Khê róc rách đêm ngày. Thiếu niên sơn thôn chân trần lội suối bắt cá, vô tình chạm phải một khối vật cứng rỉ sét dưới đáy nước sâu...',
        dialogues: [
          {
            speaker: 'Nội Tâm',
            text: 'Khối sắt đen nhám này... không ngờ lại có vân văn kỳ dị, chạm vào có cảm giác ấm áp như ngọc ôn dưỡng ngàn năm.'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Đây chẳng lẽ là bảo vật mà các vị tiên nhân ngự kiếm phi hành trong truyền thuyết vô tình đánh rơi?'
          },
          {
            speaker: 'Cổ Ngọc',
            text: 'Khẽ rung lên một tiếng "ong", một luồng linh quang mờ ảo lóe lên trong lòng bàn tay rồi tắt lịm, tựa hồ đang chờ đợi huyết mạch dẫn đạo.'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Xem xét Cổ Ngọc và đưa ra quyết định tâm niệm'
        },
        choices: [
          {
            id: 'choice_1_1_a',
            label: 'Đem về giấu kỹ nghiên cứu',
            description: 'Ẩn nhẫn trầm lặng, cẩn trọng giữ mình, tránh rước họa sát thân chốn phàm trần.',
            outcomes: {
              dialogue: 'Ngươi cẩn trọng cất khối Cổ Ngọc vào đáy hòm gỗ, đêm đêm châm đèn nghiên cứu phù văn. Tâm cảnh trở nên vững vàng, không bị lòng tham làm mờ mắt.',
              tamCanhChange: 5,
              rewardLinhThach: 50,
              rewardTuVi: 30
            }
          },
          {
            id: 'choice_1_1_b',
            label: 'Dùng máu tươi thử tẩy uế',
            description: 'Quả quyết táo bạo, dám nghịch thiên tìm kiếm cơ duyên nghịch tập.',
            outcomes: {
              dialogue: 'Ngươi cắn rách đầu ngón tay, nhỏ một giọt máu tươi lên mặt ngọc! Huyết dịch lập tức thẩm thấu, một tia tiên khí viễn cổ tràn vào kinh mạch, thức tỉnh linh tính!',
              khiVanChange: 10,
              rewardTuVi: 80,
              rewardItems: [
                { id: 'pill_tu_linh', name: 'Tụ Linh Đan', type: 'pill', quantity: 2 }
              ]
            }
          }
        ],
        epilogueOnComplete: 'Cổ ngọc đã nhận chủ, bánh xe vận mệnh của một phàm nhân bắt đầu chuyển động giữa dòng xoáy tu chân tam giới.'
      },
      {
        id: 'quest_1_2',
        chapterId: 'chap_1',
        title: 'Hồi 2: Thập Niên Nhất Mộng',
        realmRequirement: 1,
        prologue: 'Đêm xuống, trong giấc mộng sâu, thần thức ngươi như trôi dạt vào một mảnh hư không hỗn độn viễn cổ. Phía xa xa, một vị lão giả đạo bào tung bay đang ngồi xếp bằng trên tòa sen cửu sắc, miệng tụng chân kinh viễn cổ...',
        dialogues: [
          {
            speaker: 'Lão Giả Bí Ẩn',
            text: 'Trời đất bất nhân, coi vạn vật như cỏ rác. Phàm nhân muốn nghịch thiên tranh mệnh, trước hết phải dẫn khí nhập đan điền, phá tan gông cùm phàm thai!'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Từng câu chân ngôn như sấm sét nổ vang bên tai, dẫn dắt luồng nhiệt lưu cuồn cuộn xung kích kỳ kinh bát mạch!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Khí tụ đan điền, vạn pháp quy nguyên! Hôm nay ta quyết phá tan phàm trần gông cùm, vấn đỉnh tiên đạo!'
          }
        ],
        objectives: {
          type: 'reach_realm',
          targetId: 1,
          targetCount: 1,
          description: 'Đột phá đạt Luyện Khí Tầng 1'
        },
        epilogueOnComplete: 'Đan điền bừng sáng, linh khí thiên địa như suối nguồn tuôn chảy. Ngươi đã chính thức thoát khỏi phàm thai, bước vào Luyện Khí Tầng 1!'
      },
      {
        id: 'quest_1_3',
        chapterId: 'chap_1',
        title: 'Hồi 3: Yêu Lang Ban Đêm',
        realmRequirement: 1,
        prologue: 'Trăng tròn mờ sương, tiếng tru rợn tóc gáy từ đỉnh núi Hắc Phong vọng lại. Một con Huyết Nhãn Yêu Lang quanh thân lượn lờ hắc khí xé toạc màn đêm, lao thẳng về phía sơn thôn bình yên...',
        dialogues: [
          {
            speaker: 'Dân Làng',
            text: 'Trời ơi! Yêu thú xuống núi! Mau chạy đi, yêu lang này từng cắn chết mấy tay thợ săn thiện nghệ rồi!'
          },
          {
            speaker: 'Yêu Lang',
            text: 'Gầm thét dữ dội, đôi mắt đỏ rực như máu nhìn chằm chằm thiếu niên mang theo khí tức linh khí sơ khai mới thức tỉnh.'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Yêu thú này bị hấp dẫn bởi linh khí trên người ta! Nếu bỏ chạy, thôn làng ắt sẽ biến thành biển máu!'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Lựa chọn phương kế đối phó Huyết Nhãn Yêu Lang hung tợn'
        },
        choices: [
          {
            id: 'choice_1_3_a',
            label: 'Một mình dụ lang thú vào rừng sâu',
            description: 'Trảm yêu trừ ma, dám lấy thân làm mồi, bộc lộ dũng khí kiêu hùng.',
            outcomes: {
              dialogue: 'Ngươi rút thanh đoản kiếm, vận chuyển linh khí sơ khai dụ yêu lang vào hẻm núi hiểm trở. Sau trận sinh tử vật lộn, ngươi đâm thủng yết hầu hung thú, đoạt lấy Tinh Huyết thuần khiết!',
              khiVanChange: 15,
              rewardTuVi: 150,
              rewardItems: [
                { id: 'ore_thiet_tinh', name: 'Huyền Thiết Khoáng', type: 'ore', quantity: 3 }
              ]
            }
          },
          {
            id: 'choice_1_3_b',
            label: 'Hô hoán dân làng cùng vây bắt',
            description: 'Điềm tĩnh bày trận, mượn sức chúng nhân, bảo toàn sinh mạng cho bá tánh.',
            outcomes: {
              dialogue: 'Ngươi bình tĩnh chỉ huy dân làng giăng bẫy lửa và chông gai, đồng thời dùng linh lực hỗ trợ trấn áp. Yêu lang sa lưới bị trảm, dân làng cảm kích dâng tặng các loại thảo dược gia truyền!',
              tamCanhChange: 10,
              rewardLinhThach: 100,
              rewardTuVi: 100,
              rewardItems: [
                { id: 'herb_linh_thao', name: 'Bách Thảo Sơ Thiên', type: 'herb', quantity: 5 }
              ]
            }
          }
        ],
        epilogueOnComplete: 'Đầu yêu lang rơi xuống, dã tính tan biến. Sơn thôn tạm thời bình yên, nhưng ngươi hiểu rõ: chốn phàm trần này đã không còn giữ chân được bước chân tu đạo nghịch thiên.'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG II: DẪN KHÍ NHẬP ĐẠO (Luyện Khí Tầng 2 -> Tầng 5)
  // =========================================================================
  {
    id: 'chap_2',
    chapterNumber: 2,
    title: 'Chương II: Dẫn Khí Nhập Đạo',
    description: 'Thanh lọc kinh mạch phàm trần, kỳ ngộ tàn quyển động phủ cổ xưa, bước vào cảnh giới trung kỳ Luyện Khí.',
    recommendedRealm: 'Luyện Khí Tầng 2 -> Luyện Khí Tầng 5',
    bannerColor: 'from-emerald-950/60 via-teal-900/40 to-black/80',
    quests: [
      {
        id: 'quest_2_1',
        chapterId: 'chap_2',
        title: 'Hồi 1: Kinh Mạch Tắc Nghẽn',
        realmRequirement: 2,
        prologue: 'Sau trận chiến với yêu lang, linh khí trong cơ thể ngươi bắt đầu lưu chuyển nhanh hơn, nhưng mỗi khi vận chuyển qua Nhâm Đốc nhị mạch lại cảm thấy nhói buốt như kim châm. Tạp chất phàm trần qua mười mấy năm tục thực đang ngăn trở đại đạo...',
        dialogues: [
          {
            speaker: 'Nội Tâm',
            text: 'Kinh mạch bế tắc, nếu cưỡng ép thổ nạp ắt sẽ tẩu hỏa nhập ma. Cần dùng linh dược thuần khiết của Linh Điền để ôn dưỡng thanh lọc đan điền.'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Linh điền động phủ chính là căn cơ. Ta phải thu hoạch đủ thảo dược luyện hóa dược lực trừ bỏ độc tố phàm tục!'
          }
        ],
        objectives: {
          type: 'harvest_herb',
          targetCount: 5,
          description: 'Thu hoạch 5 thảo dược từ Linh Điền để điều tức kinh mạch'
        },
        epilogueOnComplete: 'Dược lực thanh lương thấm sâu vào từng thớ thịt. Kinh mạch được tẩy rửa trơn tru, khí tức quanh thân thăng hoa rõ rệt.'
      },
      {
        id: 'quest_2_2',
        chapterId: 'chap_2',
        title: 'Hồi 2: Tàn Quyển Trong Hốc Đá',
        realmRequirement: 3,
        prologue: 'Men theo khe suối ngược lên vách núi dựng đứng, ngươi phát hiện một sơn động bí ẩn bị dây leo cổ thụ che khuất. Tiến vào sâu bên trong, một bộ hài cốt ngồi xếp bằng đã hóa thạch từ ngàn năm trước, bên cạnh đặt một cuốn tàn quyển và một chiếc giới chỉ phong trần...',
        dialogues: [
          {
            speaker: 'Tiền Bối Khất Cái',
            text: 'Hư ảnh tàn hồn chợt lóe lên: "Hậu bối hữu duyên... lão phu tung hoành một đời, nay tọa hóa chỉ còn lại tàn quyển tâm pháp cùng chút di vật..."'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Trước mắt là cơ duyên ngàn năm có một của tiền bối tọa hóa. Hành xử thế nào trước nấm mồ cổ nhân để không trái đạo tâm?'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Hành xử trước hài cốt tiền nhân trong động phủ hoang phế'
        },
        choices: [
          {
            id: 'choice_2_2_a',
            label: 'Lạy tạ hài cốt rồi thỉnh bí tịch',
            description: 'Chính đạo tôn sư trọng đạo, kế thừa di chí tiền nhân một cách quang minh chính đại.',
            outcomes: {
              dialogue: 'Ngươi quỳ xuống dập đầu ba lạy thành kính. Hài cốt phát ra ánh sáng tường hòa, tàn quyển chủ động bay vào thức hải của ngươi, trao cho ngươi bí quyết tu luyện tuyệt diệu!',
              tamCanhChange: 15,
              rewardTuVi: 300,
              rewardItems: [
                { id: 'manual_dan_kinh_tan_quyen', name: 'Đan Kinh Tàn Quyển', type: 'manual', quantity: 1 }
              ]
            }
          },
          {
            id: 'choice_2_2_b',
            label: 'Phá hủy cấm chế đoạt luôn giới chỉ',
            description: 'Bá đạo quả quyết, vô câu vô thúc, đoạt hết tài nguyên thiên hạ làm của riêng.',
            outcomes: {
              dialogue: 'Ngươi vung kiếm phá nát cấm chế bảo vệ, cưỡng đoạt giới chỉ trữ vật! Hài cốt sụp đổ thành tro bụi, trong giới chỉ chứa đầy linh thạch thượng phẩm cùng bảo đan, nhưng một tia sát khí cũng bám vào đạo tâm!',
              khiVanChange: 20,
              tamCanhChange: -5,
              rewardLinhThach: 500,
              rewardTuVi: 450
            }
          }
        ],
        epilogueOnComplete: 'Đoạt được di sản tiền nhân, tu vi tăng tiến vượt bậc, ngươi bước ra khỏi sơn động với ánh mắt kiên định hơn bội phần.'
      },
      {
        id: 'quest_2_3',
        chapterId: 'chap_2',
        title: 'Hồi 3: Đột Phá Lôi Động',
        realmRequirement: 5,
        prologue: 'Sau khi dung hợp di bảo tiền nhân, linh lực trong đan điền ngươi dâng trào như thủy triều cuồn cuộn. Khí áp xung quanh chấn động, phong vân biến sắc báo hiệu bước ngoặt Luyện Khí Tầng 5 - cảnh giới trung kỳ của bậc tu sĩ sơ khai!',
        dialogues: [
          {
            speaker: 'Nội Tâm',
            text: 'Trời đất rung chuyển, linh khí hội tụ thành vòng xoáy phía trên thiên linh cái. Luyện Khí Tầng 5 ở ngay trước mắt!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Phá tan gông cùm! Đan điền hóa hải, khí kình như lôi!'
          }
        ],
        objectives: {
          type: 'reach_realm',
          targetId: 5,
          targetCount: 1,
          description: 'Đột phá đạt Luyện Khí Tầng 5'
        },
        epilogueOnComplete: 'Tiếng sấm rền vang trong kinh mạch! Ngươi chính thức tiến nhập Luyện Khí Tầng 5, khí chất thoát tục rạng ngời.'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG III: BÁI SƠN KHẢO HẠCH (Luyện Khí Tầng 6 -> Tầng 10 / Viên Mãn)
  // =========================================================================
  {
    id: 'chap_3',
    chapterNumber: 3,
    title: 'Chương III: Bái Sơn Khảo Hạch',
    description: 'Vấn Đạo Thang thử thách tâm tính, phong mang đối đầu thiên kiêu thế gia, vấn đỉnh Luyện Khí Cực Cảnh.',
    recommendedRealm: 'Luyện Khí Tầng 6 -> Luyện Khí Tầng 10 (Viên Mãn)',
    bannerColor: 'from-sky-950/60 via-indigo-900/40 to-black/80',
    quests: [
      {
        id: 'quest_3_1',
        chapterId: 'chap_3',
        title: 'Hồi 1: Thanh Vân Lôi Đài',
        realmRequirement: 6,
        prologue: 'Rời khỏi sơn thôn, ngươi vượt qua ngàn dặm sông núi tìm đến trước sơn môn của đại phái tu tiên lừng danh. Trước mắt là chín ngàn chín trăm chín mươi chín bậc Vấn Đạo Thang đâm thẳng vào mây xanh, uy áp ngập trời thử thách tâm tính vạn kẻ cầu tiên...',
        dialogues: [
          {
            speaker: 'Tiếp Dẫn Chấp Sự',
            text: 'Ai muốn bái nhập tiên môn, phải leo lên Vấn Đạo Thang, chịu đựng áp lực linh hồn. Cảnh giới dưới Luyện Khí Tầng 7 chớ có tự rước lấy nhục!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Chín ngàn bậc thang lôi kiếp thì đã sao? Ta từ sơn thôn đi ra, lòng kiên định tựa bàn thạch, quyết không lùi bước!'
          }
        ],
        objectives: {
          type: 'reach_realm',
          targetId: 7,
          targetCount: 1,
          description: 'Đạt Luyện Khí Tầng 7 để đủ tư cách tham gia khảo hạch Vấn Đạo Thang'
        },
        epilogueOnComplete: 'Mỗi bước chân đạp lên bậc thang đá là một lần tôi luyện ý chí. Ngươi hiên ngang đứng trên đỉnh Vấn Đạo Thang trong ánh mắt kinh ngạc của trưởng lão tiếp dẫn!'
      },
      {
        id: 'quest_3_2',
        chapterId: 'chap_3',
        title: 'Hồi 2: Mũi Nhọn Đối Đầu',
        realmRequirement: 8,
        prologue: 'Vừa bước lên quảng trường sơn môn, một đoàn đệ tử thế gia cẩm y ngọc đới vây quanh. Kẻ dẫn đầu là một thiếu niên ngạo mạn, thần sắc khinh khỉnh buông lời sỉ nhục xuất thân bần hàn của ngươi...',
        dialogues: [
          {
            speaker: 'Thiên Kiêu',
            text: 'Hừ! Một tên nhà quê áo vải cũng dám trèo lên Vấn Đạo Thang? Thức thời thì mau quỳ xuống dập đầu nhận thua, giao ra ngọc bài đệ tử!'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Tên này cậy thế gia tộc, tu vi Luyện Khí Tầng 8 nhưng khí tức bất ổn do dùng đan dược chồng chất.'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Tiên lộ tranh phong, mạnh được yếu thua. Hôm nay ta nên nhẫn nhịn hay rút kiếm chém tan ngạo khí của hắn?'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Ứng xử trước màn khiêu khích của thiên kiêu thế gia'
        },
        choices: [
          {
            id: 'choice_3_2_a',
            label: 'Ẩn nhẫn nhường nhịn, tích lũy thực lực',
            description: 'Đạo gia giảng thanh tĩnh vô vi, không tranh mà thắng, bảo tồn nhuệ khí.',
            outcomes: {
              dialogue: 'Ngươi lạnh nhạt mỉm cười, lướt qua như gió thoảng. Sự điềm tĩnh phi thường khiến tên thiên kiêu chưng hửng, các trưởng lão quan sát đều gật đầu tán thưởng tâm tính thâm trầm của ngươi!',
              tamCanhChange: 20,
              rewardTuVi: 600,
              rewardLinhThach: 300
            }
          },
          {
            id: 'choice_3_2_b',
            label: 'Rút kiếm nghênh phong, trấn áp ngạo khí',
            description: 'Kiếm tu vô úy, dũng khí ngút trời, một kiếm định càn khôn!',
            outcomes: {
              dialogue: 'Kiếm quang lóe lên như sấm sét! Chỉ trong nửa chiêu, kiếm phong của ngươi đã kề sát cổ họng tên thiên kiêu, khiến hắn run rẩy mặt mày tái mét trước toàn thể môn nhân!',
              khiVanChange: 25,
              rewardTuVi: 800,
              rewardTitleId: 'title_kiem_tien'
            }
          }
        ],
        epilogueOnComplete: 'Dù chọn ẩn nhẫn hay bộc lộ mũi nhọn, thanh danh của ngươi đã bắt đầu vang dội khắp ngoại môn đại phái.'
      },
      {
        id: 'quest_3_3',
        chapterId: 'chap_3',
        title: 'Hồi 3: Luyện Khí Cực Cảnh',
        realmRequirement: 10,
        prologue: 'Sau nhiều năm tu luyện khắc khổ, linh lực trong cơ thể đã đạt đến cực hạn của Luyện Khí. Mười tầng Luyện Khí viên mãn, đan điền kết tinh thành từng giọt linh dịch sáng lóa. Ngươi đứng trước ngưỡng cửa lớn nhất của đời tu sĩ: Nghịch Thiên Trúc Cơ!',
        dialogues: [
          {
            speaker: 'Chưởng Môn Trưởng Lão',
            text: 'Trúc Cơ là bước ngoặt sinh tử. Phàm nhân đắp nền móng đạo quả, thành thì thọ tăng hai trăm năm, bại thì đan điền nứt vỡ!'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Mười tầng Luyện Khí đã viên mãn vô khuyết. Đạo tâm ta như gương sáng, sẵn sàng đón nhận thiên lôi gột rửa!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Luyện Khí Cực Cảnh, đại đạo sơ thành! Hãy mở ra cánh cửa Trúc Cơ!'
          }
        ],
        objectives: {
          type: 'reach_realm',
          targetId: 10,
          targetCount: 1,
          description: 'Đột phá đạt Luyện Khí Tầng 10 (Luyện Khí Viên Mãn)'
        },
        epilogueOnComplete: 'Linh khí quanh thân ngưng kết thành giọt, hào quang rực rỡ chiếu rọi toàn thân. Ngươi đã đạt tới Luyện Khí Đại Viên Mãn, chuẩn bị Trúc Cơ Đạo Đài!'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG IV: PHONG VÂN TRÚC CƠ (Trúc Cơ Cảnh Tầng 11+)
  // =========================================================================
  {
    id: 'chap_4',
    chapterNumber: 4,
    title: 'Chương IV: Phong Vân Trúc Cơ',
    description: 'Ngưng khí hóa dịch, đúc Đạo Đài bản mệnh (Thiên Đạo Trúc Cơ vs Địa Đạo Nghịch Mệnh), vang danh tam giới.',
    recommendedRealm: 'Trúc Cơ Tầng 11+',
    bannerColor: 'from-purple-950/60 via-amber-900/40 to-black/80',
    quests: [
      {
        id: 'quest_4_1',
        chapterId: 'chap_4',
        title: 'Hồi 1: Ngưng Khí Hóa Dịch',
        realmRequirement: 11,
        prologue: 'Thiên địa dị tượng bỗng nhiên giáng xuống! Mây đen vần vũ, thiên lôi cuồn cuộn. Khí hải trong đan điền sôi trào tột độ, toàn bộ linh khí thể khí ngưng tụ thành từng dòng linh dịch thuần khiết...',
        dialogues: [
          {
            speaker: 'Nội Tâm',
            text: 'Linh khí hóa dịch, đan điền khoáng đạt gấp mười lần! Thọ nguyên tăng vọt, giác quan thấu suốt trăm dặm!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Đây chính là uy năng của Trúc Cơ Cảnh! Ta rốt cuộc đã chân chính bước vào cánh cửa tu tiên trường sinh!'
          }
        ],
        objectives: {
          type: 'reach_realm',
          targetId: 11,
          targetCount: 1,
          description: 'Nghịch thiên Trúc Cơ, chính thức bước vào Trúc Cơ Sơ Kỳ (Cảnh giới 11)'
        },
        epilogueOnComplete: 'Trúc Cơ thành công! Hào quang vạn trượng bao bọc thân thể, danh tiếng chân truyền đệ tử lan xa khắp tam sơn ngũ nhạc.'
      },
      {
        id: 'quest_4_2',
        chapterId: 'chap_4',
        title: 'Hồi 2: Trúc Cơ Đạo Đài',
        realmRequirement: 11,
        prologue: 'Khi linh dịch lắng đọng, dưới đáy đan điền bắt đầu ngưng tụ thành một tòa Đạo Đài bản mệnh. Có hai con đường lớn bày ra trước mắt: thuận theo thiên đạo vận hành đúc nên Thiên Đạo Đạo Đài thanh tịnh, hay dùng bá đạo sát phạt nghịch thiên đúc Địa Đạo Nghịch Mệnh Đài...',
        dialogues: [
          {
            speaker: 'Thần Niệm Thượng Cổ',
            text: 'Đạo sinh nhất, nhất sinh nhị. Đạo đài là nền móng vĩnh hằng của Kim Đan sau này. Ngươi muốn thuận thiên mà đi hay nghịch thiên mà đoạt?'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Một bên là an ổn trường sinh thái bình, một bên là huyết hải sát phạt uy chấn bát hoang...'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Lựa chọn bản mệnh Đạo Đài định hình tương lai Kim Đan'
        },
        choices: [
          {
            id: 'choice_4_2_a',
            label: 'Thiên Đạo Trúc Cơ (Thuận Thiên Cầu Đạo)',
            description: 'Lấy thanh tịnh đạo đức làm gốc, tâm cảnh viên mãn, linh lực hùng hậu vô biên.',
            outcomes: {
              dialogue: 'Chín tầng sen báu nở rộ trong đan điền, Thiên Đạo Đạo Đài óng ánh như ngọc thạch. Đạo tâm của ngươi tĩnh lặng như mặt hồ không chút gợn sóng!',
              tamCanhChange: 30,
              rewardTuVi: 1200,
              rewardLinhThach: 1000,
              rewardItems: [
                { id: 'pill_truc_co', name: 'Trúc Cơ Đan', type: 'pill', quantity: 2 }
              ]
            }
          },
          {
            id: 'choice_4_2_b',
            label: 'Địa Đạo Nghịch Mệnh (Bá Đạo Tự Lực)',
            description: 'Lấy sát phạt chứng đạo, cướp đoạt tạo hóa đất trời, không sợ trời không sợ đất!',
            outcomes: {
              dialogue: 'Huyết lôi rền rĩ, Địa Đạo Sát Đài sừng sững đúc thành từ ý chí bất khuất! Khí vận ngập trời, sát phạt chi khí khiến quỷ thần cũng phải kiêng dè ba phần!',
              khiVanChange: 35,
              tamCanhChange: -10,
              rewardTuVi: 1800,
              rewardLinhThach: 1500,
              rewardItems: [
                { id: 'ore_huyen_thiet', name: 'Huyền Thiết Thượng Phẩm', type: 'ore', quantity: 5 }
              ]
            }
          }
        ],
        epilogueOnComplete: 'Đạo đài đã định, đạo cơ vững như bàn thạch. Con đường tu chân từ nay rộng mở thênh thang!'
      },
      {
        id: 'quest_4_3',
        chapterId: 'chap_4',
        title: 'Hồi 3: Khai Sơn Lập Đạo',
        realmRequirement: 13,
        prologue: 'Sau khi củng cố cảnh giới Trúc Cơ, chưởng môn ban lệnh cho ngươi hạ sơn lập uy, trảm sát một đại yêu thú tác oai tác quái tại Vạn Yêu Lĩnh để bảo vệ bá tánh tam giới...',
        dialogues: [
          {
            speaker: 'Chưởng Môn Trưởng Lão',
            text: 'Trúc Cơ đệ tử chính là rường cột của tông môn. Hãy dùng kiếm trong tay chứng minh đạo quả của ngươi!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Đệ tử tuân mệnh! Chuyến này hạ sơn, quyết trảm yêu trừ ma, làm rạng danh sư môn!'
          }
        ],
        objectives: {
          type: 'defeat_boss',
          targetCount: 1,
          description: 'Trảm sát 1 Boss Thí Luyện để củng cố uy danh Trúc Cơ Đạo Sư'
        },
        epilogueOnComplete: 'Kiếm quang chém rách mây mù, đầu yêu vương rơi xuống. Ngươi chính thức trở thành một phương cường giả, uy danh hiển hách!'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG V: CỬU CHUYỂN NGƯNG ĐAN (Kim Đan Sơ Kỳ - Cảnh giới 16+)
  // =========================================================================
  {
    id: 'chap_5',
    chapterNumber: 5,
    title: 'Chương V: Cửu Chuyển Ngưng Đan',
    description: 'Vấn đỉnh Trúc Cơ viên mãn, bước vào ngưỡng cửa kết đan. Kim đan phân cửu phẩm, nhất phẩm vi hạ, cửu chuyển vi tôn. Để đúc nên tuyệt phẩm Kim Đan, tu sĩ phải chu du tìm kiếm Thiên Địa Dị Hỏa và chống lại thế lực Ma Môn rình rập.',
    recommendedRealm: 'Kim Đan Sơ Kỳ (Cảnh giới 16+)',
    bannerColor: 'from-yellow-950/70 via-amber-900/50 to-black/80',
    quests: [
      {
        id: 'quest_5_1',
        chapterId: 'chap_5',
        title: 'Hồi 1: Dị Hỏa Xuất Thế',
        realmRequirement: 16,
        prologue: 'Man Hoang hỏa mạch phun trào ngàn dặm, dung nham cuồn cuộn thấu trời. Tại đáy hỏa nham sâu vạn trượng, một đóa Thanh Liên Địa Tâm Hỏa xanh biếc lặng lẽ nở rộ, tỏa ra sóng nhiệt kinh thế hãi tục. Tu sĩ tứ phương và Ma Môn tà tu lập tức đổ xô tranh đoạt...',
        dialogues: [
          {
            speaker: 'Nội Tâm',
            text: 'Đóa Thanh Liên Dị Hỏa này ẩn chứa bản nguyên hỏa linh thiên địa, nếu hấp thu luyện hóa vào đan hỏa, tất sẽ đúc nên thượng phẩm Kim Đan!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Nhưng xung quanh cường địch rình rập, U Hồn Ma Tông cũng đã bố trí huyết sát đại trận hòng phong tỏa khu vực.'
          },
          {
            speaker: 'Đan Hỏa Chi Linh',
            text: 'Tiếng hỏa liên kêu vo ve như phượng hót, linh hỏa cuồng bạo tỏa ra sóng nhiệt bức lùi từng đợt tu sĩ muốn áp sát.'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Đưa ra sách lược thu phục Thanh Liên Địa Tâm Hỏa'
        },
        choices: [
          {
            id: 'choice_5_1_a',
            label: '[A - Đoạt Hỏa Cường Hoành]',
            description: 'Dốc toàn lực áp chế quần hùng đoạt dị hỏa (+15 Công Kích, +10 Khí Vận, -5 Tâm Cảnh).',
            outcomes: {
              dialogue: 'Ngươi phóng xuất kiếm ý tung hoành, chém rách hỏa mạch, một tay trấn áp Ma Tông cường giả đoạt lấy Thanh Liên Hỏa! Toàn thân nhiễm một tia sát khí liệt diễm.',
              congKichChange: 15,
              khiVanChange: 10,
              tamCanhChange: -5,
              rewardTuVi: 15000,
              rewardLinhThach: 5000
            }
          },
          {
            id: 'choice_5_1_b',
            label: '[B - Dẫn Hỏa Quy Nguyên]',
            description: 'Dùng thần thức từ tốn cảm hóa bản nguyên hỏa linh (+20 Tâm Cảnh, +10 Ngộ Tính).',
            outcomes: {
              dialogue: 'Ngươi ngồi xếp bằng giữa biển lửa, thần thức tĩnh lặng như nước hồ. Hỏa linh cảm ứng được đạo tâm thuần túy, chủ động hóa thành một tia thanh quang dung nhập đan điền!',
              tamCanhChange: 20,
              ngoTinhChange: 10,
              rewardTuVi: 12000,
              rewardLinhThach: 6000
            }
          }
        ],
        epilogueOnComplete: 'Thu phục thành công Thanh Liên Địa Tâm Hỏa, bản nguyên đan hỏa đã viên mãn, thời khắc ngưng tụ Kim Đan đã cận kề.'
      },
      {
        id: 'quest_5_2',
        chapterId: 'chap_5',
        title: 'Hồi 2: Cửu Chuyển Ngưng Đan',
        realmRequirement: 16,
        prologue: 'Nhập định tại Đan Hỏa Đàn của tông môn, linh khí ngàn dặm điên cuồng tụ lại như lốc xoáy. Trong đan điền, linh dịch sôi trào bắt đầu kết tinh. Đứng trước ngã rẽ phẩm cấp đan đạo: đúc Kim Đan phổ thông an toàn vững chãi, hay nghịch thiên dẫn lôi đúc Cửu Chuyển Hỗn Độn Đan?',
        dialogues: [
          {
            speaker: 'Nội Tâm',
            text: 'Đan đạo phân cửu phẩm, tam phẩm vi hạ, lục phẩm vi trung, cửu chuyển vi chí tôn.'
          },
          {
            speaker: 'Đan Hỏa Chi Linh',
            text: 'Muốn đúc Cửu Chuyển Đan, phải dẫn thiên lôi rèn luyện chín lần, cửu tử nhất sinh, hơi chút bất cẩn đan điền sẽ hóa thành tro bụi!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Tu tiên vốn là chuyện nghịch thiên cải mệnh, nếu chỉ cầu an ổn thì sao có thể nhìn thấy đại đạo đỉnh cao?'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Định đoạt phẩm cấp Kim Đan bản mệnh'
        },
        choices: [
          {
            id: 'choice_5_2_a',
            label: '[A - Cố Bản Cầu An (Ngũ Phẩm Kim Đan)]',
            description: 'Đột phá an toàn tuyệt đối, đan thành vững chắc (+20% Phòng Ngự vĩnh viễn, nhận 30,000 Tu Vi).',
            outcomes: {
              dialogue: 'Kim đan năm màu xoay tròn bình ổn trong đan điền, đạo cơ bền vững vô song, phòng ngự đại tăng!',
              phongNguChange: 25,
              rewardTuVi: 30000,
              rewardLinhThach: 8000
            }
          },
          {
            id: 'choice_5_2_b',
            label: '[B - Nghịch Thiên Đúc Đan (Cửu Chuyển Kim Đan)]',
            description: 'Dẫn lôi hỏa rèn đan, chịu vạn tiễn xuyên tâm (+15% Bạo Kích, +25 Khí Vận, nhận Danh hiệu: Cửu Chuyển Đan Tôn).',
            outcomes: {
              dialogue: 'Chín đạo kim lôi đánh thẳng vào đan điền! Kim Đan nứt ra rồi tái sinh chín lần, phát ra kim quang vạn trượng chấn động thiên địa, phong hào Cửu Chuyển Đan Tôn!',
              critRateChange: 15,
              khiVanChange: 25,
              rewardTuVi: 25000,
              rewardTitleId: 'title_cuu_chuyen_dan_ton'
            }
          }
        ],
        epilogueOnComplete: 'Nhất lạp kim đan thôn nhập phúc, thủy tri ngã mệnh do ngã bất do thiên! Kim Đan đại thành, thọ nguyên kéo dài ngàn năm!'
      },
      {
        id: 'quest_5_3',
        chapterId: 'chap_5',
        title: 'Hồi 3: Huyết Tẩy Ma Đồ',
        realmRequirement: 16,
        prologue: 'Vừa xuất quan sau khi kết đan, tiếng chuông báo động của tông môn vang vọng rền rĩ! U Hồn Ma Tông kết hợp các thế lực tà đạo bất ngờ huyết tẩy chân núi, mưu đồ đoạt lấy đan thai làm lô đỉnh luyện chế tà khí ma bảo...',
        dialogues: [
          {
            speaker: 'Ma Đầu',
            text: 'Khặc khặc! Vừa mới ngưng tụ Kim Đan đã vội xuất quan sao? Ngoan ngoãn dâng nộp đan thai cho Ma Tông ta, tha cho ngươi một con đường luân hồi!'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Sơn môn đẫm máu, đồng môn ngã xuống... Ma tà tác oai tác quái đến bực này!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Kiếm trong tay ta hôm nay sẽ uống cạn máu tà tu, tế cờ tông môn!'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Đưa ra sách lược nghênh chiến U Hồn Ma Tông'
        },
        choices: [
          {
            id: 'choice_5_3_a',
            label: '[A - Trảm Thảo Trừ Căn]',
            description: 'Xuất kiếm trảm sát Ma Đầu, tế cờ tông môn (+25 Sát khí, nhận Pháp bảo: Trảm Ma Kiếm Thai).',
            outcomes: {
              dialogue: 'Một kiếm trảm đầu Ma Đầu! Máu nhuộm đỏ đạo bào, đoạt được kiếm thai sát khí kinh hồn của Ma Tông, phong tỏa oán niệm tà ma!',
              congKichChange: 25,
              rewardItems: [
                {
                  id: 'equip_tram_ma_kiem_thai',
                  name: 'Trảm Ma Kiếm Thai',
                  type: 'equipment',
                  slot: 'weapon',
                  quality: 'cuc_pham',
                  grade: 'Cổ Bảo',
                  quantity: 1,
                  stats: { atk: 65, critRate: 10, critDmg: 25 },
                  description: 'Kiếm thai rèn từ tinh thiết Ma Tông, sát khí ngút trời, chuyên trảm ma trừ tà.'
                }
              ],
              rewardTuVi: 20000,
              rewardLinhThach: 10000
            }
          },
          {
            id: 'choice_5_3_b',
            label: '[B - Khai Trận Hộ Chúng]',
            description: 'Khởi động đại trận bảo hộ đồng môn và đệ tử yếu thế (+25 Danh Vọng, +20 Tâm Cảnh, nhận 10,000 Linh Thạch).',
            outcomes: {
              dialogue: 'Ngươi dẫn động linh lực Kim Đan duy trì hộ sơn đại trận, cứu sống hàng trăm đệ tử và trưởng lão. Tông môn tri ân, danh vọng vang dội khắp Cửu Châu!',
              danhVongChange: 25,
              tamCanhChange: 20,
              rewardLinhThach: 10000,
              rewardTuVi: 18000
            }
          }
        ],
        epilogueOnComplete: 'Ma đồ tan tác, chiến dịch bảo vệ tông môn toàn thắng. Uy danh Kim Đan cường giả của ngươi khắc sâu vào lịch sử tông môn.'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG VI: HÓA ANH ĐỘ KIẾP (Nguyên Anh Sơ Kỳ - Cảnh giới 21+)
  // =========================================================================
  {
    id: 'chap_6',
    chapterNumber: 6,
    title: 'Chương VI: Hóa Anh Độ Kiếp',
    description: 'Kim Đan phá toái, Nguyên Anh sinh ra. Một bước bước vào hàng ngũ Lão Quái ngàn năm, thọ nguyên kéo dài vạn tải. Nhưng muốn thành Nguyên Anh, phải phá bỏ chấp niệm phàm trần và đối diện với cừu oán thế gia năm xưa.',
    recommendedRealm: 'Nguyên Anh Sơ Kỳ (Cảnh giới 21+)',
    bannerColor: 'from-purple-950/70 via-indigo-900/50 to-black/80',
    quests: [
      {
        id: 'quest_6_1',
        chapterId: 'chap_6',
        title: 'Hồi 1: Đan Toái Anh Sinh',
        realmRequirement: 21,
        prologue: 'Trong mật thất bế quan sâu vạn trượng, thời khắc sinh tử đã điểm. Muốn ngưng tụ Nguyên Anh, tu sĩ buộc phải tự tay đập nát khối Kim Đan đã tôi luyện ngàn năm trong đan điền để ngưng tụ Hư Ảnh Nguyên Anh tí hon. Nỗi đau xé rách linh hồn tựa hồ vạn tiễn xuyên tâm...',
        dialogues: [
          {
            speaker: 'Nội Tâm',
            text: 'Rắc... Từng vết nứt lan rộng trên Kim Đan, linh lực mất kiểm soát điên cuồng cắn nuốt lục phủ ngũ tạng!'
          },
          {
            speaker: 'Thần Niệm Thượng Cổ',
            text: 'Phá rồi mới lập! Không dám đập tan Kim Đan thì sao có thể ngưng tụ được Hư Ảnh Nguyên Anh?'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Đan toái anh sinh, thần hồn bất diệt! Phá cho ta!'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Định hình phương thức vượt qua nỗi đau đan toái'
        },
        choices: [
          {
            id: 'choice_6_1_a',
            label: '[A - Thiết Huyết Nhẫn Nhục]',
            description: 'Cắn răng chịu đựng nỗi đau nghiền nát linh hồn (+30 Căn Cốt, +15 Miễn Thương).',
            outcomes: {
              dialogue: 'Ý chí kiên định như kim cương, đan điền mở rộng gấp trăm lần! Thân thể sau cơn đau đớn kịch liệt sản sinh ra một tầng hộ thể thần quang, miễn nhiễm mọi thương tổn tầm thường.',
              canCotChange: 30,
              dmgReductionChange: 15,
              rewardTuVi: 40000,
              rewardLinhThach: 15000
            }
          },
          {
            id: 'choice_6_1_b',
            label: '[B - Thần Niệm Hóa Hư]',
            description: 'Vận chuyển Thần Hồn bao bọc mảnh vỡ đan thai (+40 Thần Thức, +25 Chân Nguyên).',
            outcomes: {
              dialogue: 'Thần thức mênh mông như biển cả ôm trọn đan thai vỡ vụn, một tôn Nguyên Anh tí hon mở mắt trong hư vô, tỏa ra uy áp thần niệm chấn động trời đất!',
              thanThucChange: 40,
              rewardTuVi: 45000,
              rewardLinhThach: 12000
            }
          }
        ],
        epilogueOnComplete: 'Kim Đan vỡ tan, Nguyên Anh mở mắt! Thọ nguyên vượt mốc năm ngàn năm, chân chính bước vào hàng ngũ Lão Quái ngàn năm của giới tu chân.'
      },
      {
        id: 'quest_6_2',
        chapterId: 'chap_6',
        title: 'Hồi 2: Tâm Ma Vấn Tình',
        realmRequirement: 21,
        prologue: 'Nguyên Anh Lôi Kiếp giáng thế, huyễn cảnh Tâm Ma tái hiện lại bóng hình người thân và hồng nhan tri kỷ đã qua đời nơi trần thế trăm năm trước, đưa tay vẫy gọi ngươi về chốn bình yên...',
        dialogues: [
          {
            speaker: 'Tâm Ma Huyễn Ảnh',
            text: 'Tu tiên để làm gì khi người thân đều đã thành cát bụi? Hãy ở lại đây cùng ta, mãi mãi không chia lìa...'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Mùi hương quen thuộc, ánh mắt tha thiết... Trăm năm trôi qua, nỗi đau này ta tưởng đã chôn chặt dưới đáy lòng.'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Tuệ kiếm trong tay run rẩy, đứng trước ngã rẽ Trảm Tình Vấn Đạo hay Hữu Tình Thủ Hộ...'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Định đoạt đạo tâm trước ảo cảnh Tâm Ma'
        },
        choices: [
          {
            id: 'choice_6_2_a',
            label: '[A - Trảm Tình Vấn Đạo]',
            description: 'Vung tuệ kiếm cắt đứt hồng trần chấp niệm (+25 Ngộ Tính, +20% Sát thương bạo kích).',
            outcomes: {
              dialogue: 'Tuệ kiếm vung lên, ảo cảnh vỡ vụn thành trăm ngàn mảnh sáng! Đạo tâm lạnh buốt như băng tuyết ngàn năm, kiếm ý sắc bén đạt đến đỉnh phong vô song!',
              ngoTinhChange: 25,
              critDmgChange: 20,
              rewardTuVi: 50000,
              rewardLinhThach: 15000
            }
          },
          {
            id: 'choice_6_2_b',
            label: '[B - Hữu Tình Chi Đạo]',
            description: 'Ôm trọn ký ức vào lòng, biến tình xưa thành đạo tâm thủ hộ (+30 Tâm Cảnh, nhận Danh hiệu: Đa Tình Kiếm Tiên).',
            outcomes: {
              dialogue: 'Ngươi mỉm cười ôm lấy ảo ảnh: "Ta tu đạo, chính là để bảo hộ những người ta yêu thương!" Tâm ma hóa thành mưa xuân tiêu biến, đạo tâm thăng hoa rực rỡ, phong danh Đa Tình Kiếm Tiên!',
              tamCanhChange: 30,
              rewardTitleId: 'title_da_tinh_kiem_tien',
              rewardTuVi: 48000,
              rewardLinhThach: 18000
            }
          }
        ],
        epilogueOnComplete: 'Vượt qua Tâm Ma Kiếp, đạo tâm vững như bàn thạch. Lôi kiếp tan biến, Nguyên Anh pháp tướng hiển hiện chiếu rọi khắp bầu trời.'
      },
      {
        id: 'quest_6_3',
        chapterId: 'chap_6',
        title: 'Hồi 3: Đoạn Diệt Cừu Gia',
        realmRequirement: 21,
        prologue: 'Trở lại vương triều phàm tục, đối chất với Vương Thế Gia — gia tộc từng bức hại phụ mẫu và phế bỏ linh căn thuở ấu thơ. Nay ngươi ngự phong giáng thế, uy áp ngập thành trì cừu gia...',
        dialogues: [
          {
            speaker: 'Cừu Gia Tộc Trưởng',
            text: 'Tiền bối tha mạng! Năm xưa là do tiểu nhân có mắt không thấy Thái Sơn, xin tiền bối niệm tình cùng dòng máu tha cho gia tộc một con đường sống!'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Trăm năm trước, chúng coi mạng cha mẹ ta như cỏ rác, phế bỏ kinh mạch ta ném ra bờ suối... Nay lại quỳ mọp dưới chân run rẩy.'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Nhân quả tuần hoàn, báo ứng không sai. Mối nợ trăm năm này, hôm nay phải kết thúc.'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Định đoạt số phận của gia tộc cừu nhân'
        },
        choices: [
          {
            id: 'choice_6_3_a',
            label: '[A - Diệt Môn Quả Quyết]',
            description: 'Một chưởng san bằng tổ phủ thế gia, kết thúc nhân quả (+30 Công Kích, +50,000 Linh Thạch cướp phá).',
            outcomes: {
              dialogue: 'Nguyên Anh Cự Thủ từ trên trời giáng xuống, san bằng thành trì cừu gia! Tịch thu toàn bộ quốc khố linh thạch trăm năm tích lũy, trảm trừ hậu hoạn vĩnh viễn!',
              congKichChange: 30,
              rewardLinhThach: 50000,
              rewardTuVi: 35000
            }
          },
          {
            id: 'choice_6_3_b',
            label: '[B - Phế Tu Vi Khai Ân]',
            description: 'Phế sạch tu vi tộc trưởng cừu gia, để mặc dòng họ tàn lụi theo thời gian (+35 Tâm Cảnh, +20 Khí Vận).',
            outcomes: {
              dialogue: 'Một ngón tay điểm phá đan điền cừu nhân, tước bỏ mọi tu vi. Ngươi quay lưng bước đi, không vấy bẩn đạo tâm vì lũ giun dế. Tâm cảnh thấu triệt, khí vận gia tăng!',
              tamCanhChange: 35,
              khiVanChange: 20,
              rewardTuVi: 40000,
              rewardLinhThach: 25000
            }
          }
        ],
        epilogueOnComplete: 'Mối thù phàm trần đã đoạn, nhân quả trần thế tiêu tan. Thân tâm thanh thản, tiêu dao tự tại vấn đỉnh đại đạo.'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG VII: HÓA THẦN VẤN ĐẠO (Hóa Thần Sơ Kỳ - Cảnh giới 26+)
  // =========================================================================
  {
    id: 'chap_7',
    chapterNumber: 7,
    title: 'Chương VII: Hóa Thần Vấn Đạo',
    description: 'Từ "Tu Tiên" bước sang "Ngộ Đạo". Tu sĩ Hóa Thần không còn đơn thuần thổ nạp linh khí mà phải dung nhập thiên địa, hóa thân thành phàm nhân trải nghiệm sinh lão bệnh tử trăm năm nơi hồng trần để đúc kết ra Ý Cảnh Bản Thể và khai mở Thần Chi Lĩnh Vực.',
    recommendedRealm: 'Hóa Thần Sơ Kỳ (Cảnh giới 26+)',
    bannerColor: 'from-rose-950/70 via-amber-950/50 to-black/80',
    quests: [
      {
        id: 'quest_7_1',
        chapterId: 'chap_7',
        title: 'Hồi 1: Hóa Phàm Trăm Năm',
        realmRequirement: 26,
        prologue: 'Phong ấn toàn bộ tu vi, hóa trang thành một lão thợ mộc bình dị nơi cổ trấn phàm trần, chứng kiến bạn bè phàm nhân dần già đi và chết. Hóa phàm trăm năm, nếm trải nỗi cay đắng ngọt bùi của kiếp người...',
        dialogues: [
          {
            speaker: 'Cổ Trấn Lão Nhân',
            text: 'Lão Trương à, đời người ngắn ngủi vài mươi năm, nháy mắt đã bạc đầu. Chớp mắt một cái, đám trẻ con năm nào giờ cũng đã thành ông thành bà...'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Nhát đao này chạm vào thớ gỗ, khắc họa nếp nhăn của thời gian. Phàm nhân tuy yếu đuối, nhưng sinh mệnh của họ lại rực rỡ và mãnh liệt biết bao.'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Hóa phàm trăm năm, rốt cuộc là ta đang trải nghiệm đời người, hay đại đạo đang mượn thân xác ta để thấu suốt nhân gian?'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Định hình con đường Hóa Phàm ngộ chân lý'
        },
        choices: [
          {
            id: 'choice_7_1_a',
            label: '[A - Khắc Tượng Ngộ Đạo]',
            description: 'Dùng từng nhát đao khắc họa năm tháng sinh lão bệnh tử (+35 Ngộ Tính, +30 Tâm Cảnh).',
            outcomes: {
              dialogue: 'Từng pho tượng gỗ vô tri dưới tay ngươi bỗng nhiên như có linh hồn! Ngộ tính đột phá cực hạn, tâm cảnh đạt đến cảnh giới vô vi thanh tịnh, thấu triệt quy luật thời gian!',
              ngoTinhChange: 35,
              tamCanhChange: 30,
              rewardTuVi: 80000,
              rewardLinhThach: 30000
            }
          },
          {
            id: 'choice_7_1_b',
            label: '[B - Hồng Trần Du Lịch]',
            description: 'Bước chân qua vạn dặm non sông, thưởng thức nhân gian thế sự (+25 Khí Vận, +20 Thần Thức).',
            outcomes: {
              dialogue: 'Dấu chân ngươi in khắp ngõ ngách nhân gian, thần thức trải dài theo dòng chảy thời đại. Khí vận cuồn cuộn đổ về, thần thức bao la như trời đất!',
              khiVanChange: 25,
              thanThucChange: 20,
              rewardTuVi: 75000,
              rewardLinhThach: 35000
            }
          }
        ],
        epilogueOnComplete: 'Trăm năm trôi qua như một giấc mộng dài. Cổ nhân đều đã thành nắm cát vàng, nhưng trong tâm thức ngươi, hạt giống Ý Cảnh đã bắt đầu nảy mầm.'
      },
      {
        id: 'quest_7_2',
        chapterId: 'chap_7',
        title: 'Hồi 2: Sinh Tử Ý Cảnh',
        realmRequirement: 26,
        prologue: 'Tại đêm đông tuyết rơi cuối cùng của kiếp hóa phàm, đối diện với ranh giới sinh - tử mỏng manh, ngộ ra quy luật Luân Hồi của thiên địa, thấu suốt sinh tử bản nguyên...',
        dialogues: [
          {
            speaker: 'Nội Tâm',
            text: 'Sinh tức là tử, tử tức là sinh. Vạn vật sinh ra từ hư vô rồi lại trở về với cát bụi.'
          },
          {
            speaker: 'Thần Niệm Thượng Cổ',
            text: 'Ngươi muốn chưởng khống Tịch Diệt Tuyệt Vọng, hay muốn nắm giữ Sinh Sinh Bất Tức?'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Đại đạo ba ngàn, hôm nay ta đúc kết Ý Cảnh của riêng mình, ngạo thị quần hùng!'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Định hình Bản Nguyên Ý Cảnh Hóa Thần'
        },
        choices: [
          {
            id: 'choice_7_2_a',
            label: '[A - Tịch Diệt Ý Cảnh]',
            description: 'Ngộ ra vạn vật quy về hư vô, vạn pháp tịch diệt (+25% Sát thương chuẩn, mở khóa hiệu ứng Tuyệt Diệt).',
            outcomes: {
              dialogue: 'Tuyết trắng quanh ngươi hóa thành tro tàn đen nhánh! Tịch Diệt Ý Cảnh bùng nổ, mọi đòn đánh từ nay kèm theo sát thương chuẩn hủy diệt, phá tan vạn tầng phòng ngự của đối thủ!',
              congKichChange: 40,
              critDmgChange: 25,
              rewardTuVi: 100000,
              rewardLinhThach: 40000
            }
          },
          {
            id: 'choice_7_2_b',
            label: '[B - Sinh Sinh Bất Tức]',
            description: 'Ngộ ra trong cái chết nhen nhóm mầm sống mới (+30% Khí Huyết, +10% Hồi Máu mỗi hiệp).',
            outcomes: {
              dialogue: 'Giữa đêm đông tuyết trắng, một đóa hoa xanh biếc bỗng đâm chồi nở rộ dưới chân ngươi! Khí huyết bùng nổ như rồng thiêng, sinh cơ bất diệt tuần hoàn vĩnh cửu!',
              hpPercentChange: 30,
              canCotChange: 35,
              rewardTuVi: 95000,
              rewardLinhThach: 45000
            }
          }
        ],
        epilogueOnComplete: 'Ý Cảnh đại thành! Một vòng luân hồi sinh tử hiển hiện sau lưng, đạo quả Hóa Thần đã định hình hoàn chỉnh.'
      },
      {
        id: 'quest_7_3',
        chapterId: 'chap_7',
        title: 'Hồi 3: Khai Mở Thần Chi Lĩnh Vực',
        realmRequirement: 26,
        prologue: 'Phá phong giải ấn, dẫn động thiên địa dị tượng kinh động toàn bộ đại lục, ngưng tụ Pháp Tướng Cự Thần và trải rộng Thần Vực của riêng mình...',
        dialogues: [
          {
            speaker: 'Pháp Tướng Cự Thần',
            text: 'Gầm lên một tiếng làm rung chuyển cửu châu, chư thiên tinh tú vì đó mà lu mờ!'
          },
          {
            speaker: 'Thiên Kiêu',
            text: 'Trời ơi! Đó là khí tức của Hóa Thần Lĩnh Vực! Đại lục ngàn năm qua rốt cuộc lại có một vị Hóa Thần Thiên Tôn xuất thế!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Thiên địa trong lòng bàn tay, càn khôn trong một ý niệm! Khai mở Lĩnh Vực!'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Định hình Thần Chi Lĩnh Vực thống ngự thiên hạ'
        },
        choices: [
          {
            id: 'choice_7_3_a',
            label: '[A - Vạn Cổ Duy Ngã]',
            description: 'Khai mở Bá Đạo Lĩnh Vực, áp chế toàn bộ tu sĩ dưới trần thế (+50 Công Kích, nhận Danh hiệu độc quyền: Hóa Thần Thiên Tôn).',
            outcomes: {
              dialogue: 'Lĩnh vực vàng rực rực rỡ ngàn dặm trải rộng, vạn tu sĩ đều phải cúi đầu thần phục trước uy áp kinh thiên! Phong hiệu Hóa Thần Thiên Tôn vang dội tam giới!',
              congKichChange: 50,
              rewardTitleId: 'title_hoa_than_thien_ton',
              rewardTuVi: 150000,
              rewardLinhThach: 80000
            }
          },
          {
            id: 'choice_7_3_b',
            label: '[B - Thiên Đạo Tự Nhiên]',
            description: 'Khai mở Thái Hư Lĩnh Vực, hòa mình cùng quy tắc càn khôn (+35 Thủ, +35 Thần Thức, nhận Dị bảo: Thái Hư Hồn Ngọc).',
            outcomes: {
              dialogue: 'Thân ảnh ngươi tan biến vào hư không càn khôn, vạn pháp bất xâm! Thu nhận bảo vật trấn thế Thái Hư Hồn Ngọc, thần thức câu thông chư thiên tinh vực!',
              phongNguChange: 35,
              thanThucChange: 35,
              rewardItems: [
                {
                  id: 'equip_thai_hu_hon_ngoc',
                  name: 'Thái Hư Hồn Ngọc',
                  type: 'equipment',
                  slot: 'artifact',
                  quality: 'than_thoai',
                  grade: 'Tiên Thiên Linh Bảo',
                  quantity: 1,
                  stats: { def: 60, soul: 50, hp: 500 },
                  description: 'Thái Hư Hồn Ngọc ngưng tụ từ hỗn độn hư không, uẩn dưỡng thần thức, hóa giải vạn pháp.'
                }
              ],
              rewardTuVi: 140000,
              rewardLinhThach: 90000
            }
          }
        ],
        epilogueOnComplete: 'Thần Vực khai mở, Hóa Thần viên mãn! Ngươi chính thức trở thành một vị Hóa Thần Thiên Tôn cái thế, phóng tầm mắt nhìn về tiên giới xa xôi...'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG VIII: TINH KHÔNG VẤN ĐẠO (Luyện Hư Kỳ - Cảnh giới 31+)
  // =========================================================================
  {
    id: 'chap_8',
    chapterNumber: 8,
    title: 'Chương VIII: Tinh Không Vấn Đạo',
    description: 'Bước ra khỏi ranh giới đại lục, vượt qua Loạn Lưu Kiếm Cương, thám hiểm vực ngoại tinh không hoang phế và lựa chọn trận doanh giữa chư thiên.',
    recommendedRealm: 'Luyện Hư Kỳ (Cảnh giới 31+)',
    bannerColor: 'from-indigo-950/80 via-purple-900/60 to-black/90',
    quests: [
      {
        id: 'quest_8_1',
        chapterId: 'chap_8',
        title: 'Hồi 1: Phá Toái Hư Không',
        realmRequirement: 31,
        prologue: 'Tu vi đạt tới Luyện Hư Kỳ, giới bích của tiểu thế giới không còn chịu nổi uy áp bản thể. Tu sĩ đứng trước thiên môn vạn trượng, chuẩn bị phá giới xông vào loạn lưu hư không...',
        dialogues: [
          {
            speaker: 'Giới Linh Hộ Đạo',
            text: 'Đạo hữu tu vi đã đạt Luyện Hư, bản giới không thể dung nạp thêm khí cơ của ngươi nữa. Phía ngoài giới bích là Vực Ngoại Loạn Lưu, kiếm cương hung hiểm vạn phần!'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Tiểu thế giới này cuối cùng cũng không giam cầm nổi chí hướng của ta. Tiên lộ dài đằng đẵng, há có thể dừng bước ở chốn này?'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Kiếm cương loạn lưu thì đã sao? Hôm nay ta dĩ thân phá giới, mở đường vấn đạo giữa tinh không!'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Quyết định phương thức phá giới vượt qua giới bích'
        },
        choices: [
          {
            id: 'choice_8_1_a',
            label: '[A - Cực Kiếm Phá Giới]',
            description: 'Vung kiếm xé toang ranh giới không gian, đón nhận loạn lưu rèn thể (+45 Công Kích, +25 Thần Thức, +10 Khí Vận, -10 Tâm Cảnh).',
            outcomes: {
              dialogue: 'Kiếm quang rực rỡ chém tan giới bích! Loạn lưu hư không điên cuồng cắn xé đạo thể, rèn luyện sát phạt kiếm ý vô song nhưng cũng lưu lại chút tâm ma dao động!',
              congKichChange: 45,
              thanThucChange: 25,
              khiVanChange: 10,
              tamCanhChange: -10,
              rewardTuVi: 180000,
              rewardLinhThach: 100000
            }
          },
          {
            id: 'choice_8_1_b',
            label: '[B - Thận Trọng Vượt Ải]',
            description: 'Dùng pháp trận và độn thuật bao bọc thân mình, nhẹ nhàng trôi qua khe nứt không gian (+40 Phòng Ngự, +35 Tâm Cảnh, +25 Căn Cốt).',
            outcomes: {
              dialogue: 'Ngươi kết ấn bố trí Cửu Khúc Hư Không Trận, thân thể tựa lông hồng lướt qua vết rách giới bích, tâm cảnh an tĩnh bất động như bàn thạch!',
              phongNguChange: 40,
              tamCanhChange: 35,
              canCotChange: 25,
              rewardTuVi: 180000,
              rewardLinhThach: 100000
            }
          }
        ],
        epilogueOnComplete: 'Giới bích đã tan biến sau lưng. Trước mắt ngươi là dải ngân hà vô tận sâu thẳm, chính thức đặt chân vào Vực Ngoại Tinh Không!'
      },
      {
        id: 'quest_8_2',
        chapterId: 'chap_8',
        title: 'Hồi 2: Tinh Hải Tranh Đoạt',
        realmRequirement: 31,
        prologue: 'Bước vào Vực Ngoại Tinh Không, phát hiện một cổ tinh hoang phế chứa đầy Thái Ất Tinh Khoáng lấp lánh ánh kim, nhưng đang bị một đầu Tinh Không Cổ Thú khổng lồ chiếm cứ...',
        dialogues: [
          {
            speaker: 'Nội Tâm',
            text: 'Cổ tinh phía trước tỏa ra linh cơ Thái Ất dạt dào, nếu khai thác được ắt là đại cơ duyên cho bản mệnh pháp bảo!'
          },
          {
            speaker: 'Tinh Không Cổ Thú',
            text: 'Gầm thét làm rung chuyển ngàn dặm tinh vân, thân hình tựa ngọn cự thạch vắt ngang tinh hà, đôi mắt đỏ ngầu trừng trừng đe dọa!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Hung thú vực ngoại quả nhiên hung hãn, nhưng khoáng thạch Thái Ất này há có thể chắp tay dâng cho nghiệt súc?'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Quyết định phương thức đối phó Tinh Không Cổ Thú'
        },
        choices: [
          {
            id: 'choice_8_2_a',
            label: '[A - Trảm Thú Đoạt Tinh]',
            description: 'Dốc toàn lực trảm sát hung thú, hấp thu tinh hoa cổ thú (+55 Công Kích, +15% Sát Thương Bạo Kích, nhận Cổ Bảo: Tinh Hải Thần Trâm).',
            outcomes: {
              dialogue: 'Kiếm ý thông thiên chém đứt đầu cổ thú! Huyết tinh cổ thú ngưng tụ thành Cổ Bảo Tinh Hải Thần Trâm uy lực kinh người, sát khí bạo phát chấn nhiếp tinh vực!',
              congKichChange: 55,
              critDmgChange: 15,
              rewardItems: [
                {
                  id: 'equip_tinh_hai_than_tram',
                  name: 'Tinh Hải Thần Trâm',
                  type: 'equipment',
                  slot: 'artifact',
                  quality: 'than_thoai',
                  grade: 'Thái Cổ Cổ Bảo',
                  quantity: 1,
                  stats: { atk: 150, def: 50 },
                  description: 'Cổ bảo đúc từ tinh hạch của Tinh Không Cổ Thú, có khả năng định hải định tinh, tăng 150 ATK và 5% Kháng Bạo.'
                }
              ],
              rewardTuVi: 220000,
              rewardLinhThach: 120000
            }
          },
          {
            id: 'choice_8_2_b',
            label: '[B - Thuần Hóa Cổ Linh]',
            description: 'Dùng thần niệm giao cảm, chia sẻ linh khí xoa dịu linh trí hung thú (+45 Ngộ Tính, +40 Thần Thức, nhận Danh hiệu Thiên Phẩm: Tinh Không Du Giả).',
            outcomes: {
              dialogue: 'Thần niệm nhu hòa thấm sâu vào linh hồn cổ thú, hung quang trong mắt nó dần tiêu tán, hóa thành sự quy phục và cảm kích. Ngươi đắc ngộ bí pháp du ngoạn hư không, nhận phong hiệu Tinh Không Du Giả!',
              ngoTinhChange: 45,
              thanThucChange: 40,
              rewardTitleId: 'title_tinh_khong_du_gia',
              rewardTuVi: 220000,
              rewardLinhThach: 120000
            }
          }
        ],
        epilogueOnComplete: 'Chiến đấu hay thuần dưỡng đều đem lại thu hoạch vô giá. Tinh hạch Thái Ất đã nằm trong tay, danh tiếng vang xa tới trạm dịch vực ngoại.'
      },
      {
        id: 'quest_8_3',
        chapterId: 'chap_8',
        title: 'Hồi 3: Tiên Ma Trận Doanh',
        realmRequirement: 31,
        prologue: 'Đến Tinh Lộ dịch trạm, nơi giao thoa của vạn giới tu sĩ. Hai đại cự phách vực ngoại là Thái Cổ Tiên Minh và Vạn Ma Tinh Vực đồng thời phái đặc sứ đến chiêu dụ cường giả Luyện Hư...',
        dialogues: [
          {
            speaker: 'Sứ Giả Tiên Minh',
            text: 'Tiên Minh chưởng khống trật tự chư thiên, giữ gìn đại đạo thăng bằng. Đạo hữu gia nhập sẽ được ban thưởng ấn tín chấp pháp, muôn giới nể sợ!'
          },
          {
            speaker: 'Ma Tộc Tôn Giả',
            text: 'Hừ! Tiên Minh giả nhân giả nghĩa, quy củ trói buộc! Nhập Ma Tinh Vực ta, sát phạt tùy tâm, tiêu dao tự tại, cầu đạo bất phược!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Một bên là quy củ trật tự thái bình, một bên là sát phạt tự do vô úy... Đạo của ta, thuộc về phương nào?'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Lựa chọn trận doanh quy thuộc nơi Vực Ngoại Tinh Không'
        },
        choices: [
          {
            id: 'choice_8_3_a',
            label: '[A - Gia Nhập Tiên Minh]',
            description: 'Nhận ấn tỉ chấp pháp, giữ gìn trật tự tinh vực (+40 Phòng Ngự, +45 Tâm Cảnh, +100,000 Linh Thạch, nhận Danh hiệu: Tiên Minh Chấp Pháp Sứ).',
            outcomes: {
              dialogue: 'Tiếp nhận Kim Sắc Lệnh Bài của Thái Cổ Tiên Minh, hào quang chính đạo bao bọc thân mình! Ngươi chính thức trở thành Tiên Minh Chấp Pháp Sứ, vạn tà tránh lui!',
              phongNguChange: 40,
              tamCanhChange: 45,
              rewardLinhThach: 100000,
              rewardTitleId: 'title_tien_minh_chap_phap',
              rewardTuVi: 250000
            }
          },
          {
            id: 'choice_8_3_b',
            label: '[B - Nhập Trận Ma Vực]',
            description: 'Tự do phóng túng, lấy sát phạt làm đao, không chịu ước thúc (+65 Công Kích, +20% Bạo Kích, +15% Ma Tính, nhận Danh hiệu: Tinh Vực Ma Quân).',
            outcomes: {
              dialogue: 'Uống cạn chén Ma Huyết Rượu, sát khí ngút trời bao phủ tinh hà! Không chịu bất kỳ trật tự giả tạo nào trói buộc, ngươi bước lên ngôi vị Tinh Vực Ma Quân, sát phạt tùy tâm!',
              congKichChange: 65,
              critRateChange: 20,
              maTinhChange: 15,
              rewardTitleId: 'title_tinh_vuc_ma_quan',
              rewardTuVi: 250000,
              rewardLinhThach: 100000
            }
          }
        ],
        epilogueOnComplete: 'Trận doanh đã định! Dù là Tiên hay Ma, ngươi cũng đã tạo dựng được chỗ đứng vững chắc giữa biển người vực ngoại, hướng tới đỉnh cao Độ Kiếp...'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG IX: CỬU CỬU THIÊN KIẾP & PHI THĂNG TIÊN GIỚI (Độ Kiếp Kỳ - Cảnh giới 46+)
  // =========================================================================
  {
    id: 'chap_9',
    chapterNumber: 9,
    title: 'Chương IX: Cửu Cửu Thiên Kiếp & Phi Thăng Tiên Giới',
    description: 'Đối mặt với 81 đạo Cửu Cửu Hỗn Độn Tử Lôi, trực tiếp đàm đạo cùng Thiên Đạo Chi Ý và đưa ra quyết định tối hậu: Phi Thăng Thượng Giới hay Trấn Thủ Cố Thổ.',
    recommendedRealm: 'Độ Kiếp Kỳ (Cảnh giới 46+)',
    bannerColor: 'from-purple-950/90 via-violet-900/70 to-amber-950/80',
    quests: [
      {
        id: 'quest_9_1',
        chapterId: 'chap_9',
        title: 'Hồi 1: Cửu Cửu Đại Kiếp',
        realmRequirement: 46,
        prologue: 'Mây đen lôi đình bao trùm vạn dặm tinh không, 81 đạo Hỗn Độn Tử Lôi chuẩn bị giáng lâm hủy diệt nghịch tu. Thiên uy hiển hiện, không gian xung quanh từng tấc sụp đổ...',
        dialogues: [
          {
            speaker: 'Thiên Lôi Chi Hồn',
            text: 'Phàm thai nghịch thiên tu hành, dám mơ tưởng trường sinh bất tử! Hôm nay 81 đạo Cửu Cửu Tử Lôi sẽ đem nhục thân và hồn phách ngươi hóa thành tro bụi!'
          },
          {
            speaker: 'Khí Linh Hộ Chủ',
            text: 'Chủ nhân cẩn thận! Uy lực tử lôi này gấp trăm lần thiên kiếp bình thường, xin hãy kích hoạt toàn bộ phòng ngự trận pháp!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Tu sĩ chúng ta vốn là đoạt thiên địa tạo hóa, nếu sợ hãi lôi kiếp thì sao xứng xưng tôn xưng đế?'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Quyết định phương pháp vượt qua 81 đạo Cửu Cửu Tử Lôi'
        },
        choices: [
          {
            id: 'choice_9_1_a',
            label: '[A - Dĩ Thân Hóa Lôi]',
            description: 'Không dùng hộ thuẫn, mở rộng 360 huyệt đạo nghênh đón thiên lôi tôi luyện thể phách (+60 Căn Cốt, +15% Miễn Thương vĩnh viễn, +150,000 Tu Vi, -40% HP tạm thời).',
            outcomes: {
              dialogue: 'Tử lôi kinh thiên bổ thẳng vào đỉnh đầu! Ngươi cắn răng chịu đựng nỗi đau xé thịt rách xương, 360 huyệt đạo như động không đáy nuốt trọn lôi uy, đúc nên Lôi Kiếp Bất Diệt Thể!',
              canCotChange: 60,
              dmgReductionChange: 15,
              hpPercentChange: -40,
              rewardTuVi: 150000,
              rewardLinhThach: 100000
            }
          },
          {
            id: 'choice_9_1_b',
            label: '[B - Vạn Bảo Trừ Kiếp]',
            description: 'Kích hoạt toàn bộ phù trận và pháp bảo, dệt thành thiên la địa võng hóa giải lôi uy (+60 Thần Thức, +60 Phòng Ngự, +150,000 Linh Thạch bồi hoàn nguyên liệu).',
            outcomes: {
              dialogue: 'Hàng ngàn kiện bảo vật và phù lục sáng rực cả tinh hà, hóa giải từng đạo tử lôi sấm sét thành linh khí thuần khiết! Thần thức điều khiển vạn bảo đạt tới cảnh giới nhập thần vi diệu!',
              thanThucChange: 60,
              phongNguChange: 60,
              rewardLinhThach: 150000,
              rewardTuVi: 150000
            }
          }
        ],
        epilogueOnComplete: '81 đạo Cửu Cửu Tử Lôi tan biến, tinh vân trở lại vẻ tĩnh lặng. Ngươi đã đứng vững trước đòn trừng phạt khắc nghiệt nhất của trời đất!'
      },
      {
        id: 'quest_9_2',
        chapterId: 'chap_9',
        title: 'Hồi 2: Vấn Đạo Thiên Tâm',
        realmRequirement: 46,
        prologue: 'Lôi kiếp tan biến, hư ảnh khổng lồ của Thiên Đạo Chi Ý hiển hóa giữa tinh không vô tận, ngưng tụ thành một đôi mắt vô cảm nhìn thấu vạn cổ, cất lời chất vấn bản chất con đường tu tiên...',
        dialogues: [
          {
            speaker: 'Thiên Đạo Chi Ý',
            text: 'Trời đất sinh dưỡng ngươi, cho ngươi linh khí, ban ngươi cơ duyên. Ngươi tu đạo là vì cướp đoạt trời đất cho riêng mình, hay là muốn cùng thiên địa đồng quy?'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Thiên Đạo vấn tâm! Mỗi lời nói lúc này đều đại diện cho bản nguyên đạo tâm, quyết định trực tiếp quy tắc đạo quả tương lai!'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Đại đạo mịt mờ, nhưng bản tâm của ta... từ thuở thiếu niên tới nay chưa từng lay chuyển!'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Đối đáp huyền môn, định hình Đạo Quả trước Thiên Đạo Chi Ý'
        },
        choices: [
          {
            id: 'choice_9_2_a',
            label: '[A - Nghịch Thiên Độc Tôn]',
            description: '"Đạo của ta do ta định đoạt, sinh mệnh của ta không thuộc về thiên địa!" (+90 Công Kích, +35 Khí Vận, nhận Danh hiệu Thần Phẩm: Nghịch Thiên Đạo Tôn).',
            outcomes: {
              dialogue: 'Tiếng gầm của ngươi xé toạc tinh không: "Ta mệnh do ta bất do thiên!" Thiên Đạo Chi Ý khẽ rung chuyển rồi tán thưởng lui bước. Ngươi ngưng tụ Nghịch Thiên Đạo Quả, vạn cổ duy ngã xưng tôn!',
              congKichChange: 90,
              khiVanChange: 35,
              rewardTitleId: 'title_nghich_thien_dao_ton',
              rewardTuVi: 300000,
              rewardLinhThach: 150000
            }
          },
          {
            id: 'choice_9_2_b',
            label: '[B - Hợp Đạo Tự Nhiên]',
            description: '"Ta thuận theo đại đạo, thân hóa vạn vật, tương sinh cùng thiên địa." (+60 Ngộ Tính, +60 Tâm Cảnh, nhận Tiên Thiên Dị Bảo: Hỗn Độn Đạo Chủng).',
            outcomes: {
              dialogue: 'Ngươi mỉm cười buông bỏ chấp niệm, hòa tan bản thân vào nhịp thở của chư thiên tinh tú. Thiên Đạo Chi Ý ban tặng Tiên Thiên Dị Bảo Hỗn Độn Đạo Chủng, đạo tâm thông thấu viên mãn!',
              ngoTinhChange: 60,
              tamCanhChange: 60,
              rewardItems: [
                {
                  id: 'equip_hon_don_dao_chung',
                  name: 'Hỗn Độn Đạo Chủng',
                  type: 'equipment',
                  slot: 'artifact',
                  quality: 'than_thoai',
                  grade: 'Tiên Thiên Dị Bảo',
                  quantity: 1,
                  stats: { atk: 120, def: 120, soul: 100 },
                  description: 'Hạt giống sơ khai của trời đất ban tặng khi hợp đạo, tăng 30% tốc độ thổ nạp và giảm 50% nguy cơ tâm ma.'
                }
              ],
              rewardTuVi: 300000,
              rewardLinhThach: 150000
            }
          }
        ],
        epilogueOnComplete: 'Đạo tâm đã viên mãn, Đạo Quả đã đúc thành. Phía chân trời tinh không, một đạo quang trụ rực rỡ từ trên cửu thiên bắt đầu hạ xuống...'
      },
      {
        id: 'quest_9_3',
        chapterId: 'chap_9',
        title: 'Hồi 3: Phi Thăng Tiếp Dẫn',
        realmRequirement: 46,
        prologue: 'Tiên Giới Chi Môn mở toang, tiên nhạc vang lừng muôn trượng, tiếp dẫn hà quang chiếu rọi khắp tam thiên đại thế giới. Đã đến lúc đưa ra quyết định tối hậu của kiếp tu sĩ cõi phàm trần...',
        dialogues: [
          {
            speaker: 'Tiên Giới Tiếp Dẫn Sứ',
            text: 'Chúc mừng đạo hữu độ kiếp thành công! Cửa Tiên Giới đã mở, thượng giới tiên đài đang chờ đạo hữu thăng tọa, thoát ly bể khổ hồng trần!'
          },
          {
            speaker: 'Nội Tâm',
            text: 'Nhìn lại cố hương, sơn thôn thuở nhỏ, tông môn bằng hữu... Nếu bước vào cánh cổng kia, trần duyên kiếp này xem như dứt sạch.'
          },
          {
            speaker: 'Đạo Hữu',
            text: 'Tu hành trăm vạn năm, một bước này... chính là định đoạt vĩnh hằng!'
          }
        ],
        objectives: {
          type: 'make_choice',
          description: 'Đưa ra quyết định tối hậu: Phi Thăng hay Trấn Thủ'
        },
        choices: [
          {
            id: 'choice_9_3_a',
            label: '[A - Hạo Nhiên Phi Thăng]',
            description: 'Rũ bỏ hồng trần, đạp mây vàng thẳng tiến Tiên Giới thượng tầng (+60 Toàn Bộ Chỉ Số, nhận Danh hiệu Thần Phẩm: Chân Tiên Hóa Thân).',
            outcomes: {
              dialogue: 'Ngươi dứt khoát đạp mây vàng bay vút vào Tiên Giới Chi Môn! Tiên khí thượng giới tẩy lễ toàn diện, thoát thai hoán cốt trở thành Chân Tiên Hóa Thân kim quang chói lọi!',
              congKichChange: 60,
              phongNguChange: 60,
              canCotChange: 60,
              ngoTinhChange: 60,
              thanThucChange: 60,
              rewardTitleId: 'title_chan_tien_hoa_than',
              rewardTuVi: 500000,
              rewardLinhThach: 200000
            }
          },
          {
            id: 'choice_9_3_b',
            label: '[B - Trấn Áp Giới Môn]',
            description: 'Tạm hoãn phi thăng, dùng đại thần thông phong ấn lối vào, lưu lại bảo hộ cố thổ quê hương (+120 Phòng Ngự, +120 Căn Cốt, +80 Tâm Cảnh, nhận Danh hiệu Thần Phẩm: Nhân Gian Trấn Thủ Giả).',
            outcomes: {
              dialogue: 'Ngươi vung tay phong ấn Tiên Giới Chi Môn, cắm đại kiếm xuống ranh giới nhân gian: "Nhân gian này còn có người ta muốn che chở!" Khí phách kinh thiên khiến vạn linh cảm phục, xưng tụng Nhân Gian Trấn Thủ Giả!',
              phongNguChange: 120,
              canCotChange: 120,
              tamCanhChange: 80,
              dmgReductionChange: 10,
              rewardTitleId: 'title_nhan_gian_tran_thu',
              rewardTuVi: 500000,
              rewardLinhThach: 200000
            }
          }
        ],
        epilogueOnComplete: 'Dù phi thăng thượng giới hay trấn thủ thế gian, truyền kỳ của ngươi đã khắc sâu vào bia đá ngàn năm, trở thành thần thoại bất diệt của muôn đời sau!'
      }
    ]
  }
];

// Helper lấy toàn bộ danh sách quest phẳng
export function getAllQuests(): StorylineQuest[] {
  const all: StorylineQuest[] = [];
  for (const chap of STORYLINE_CHAPTERS) {
    for (const q of chap.quests) {
      all.push(q);
    }
  }
  return all;
}

// Lấy quest theo ID
export function getQuestById(questId: string): StorylineQuest | undefined {
  return getAllQuests().find(q => q.id === questId);
}

// Lấy Chapter theo ID
export function getChapterById(chapterId: string): StorylineChapter | undefined {
  return STORYLINE_CHAPTERS.find(c => c.id === chapterId);
}

// Lấy Chapter chứa Quest theo Quest ID
export function getChapterByQuestId(questId: string): StorylineChapter | undefined {
  return STORYLINE_CHAPTERS.find(chap => chap.quests.some(q => q.id === questId));
}

// Lấy Quest tiếp theo sau quest hiện tại
export function getNextQuest(questId: string): StorylineQuest | null {
  const all = getAllQuests();
  const idx = all.findIndex(q => q.id === questId);
  if (idx >= 0 && idx < all.length - 1) {
    return all[idx + 1];
  }
  return null;
}

// Tạo trạng thái StorylineState mặc định cho người chơi mới
export function createDefaultStorylineState(): StorylineState {
  return {
    currentChapterId: 'chap_1',
    activeQuestId: 'quest_1_1',
    completedQuestIds: [],
    choiceHistory: {}
  };
}
