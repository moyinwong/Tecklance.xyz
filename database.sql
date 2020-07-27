
CREATE DATABASE tecklance;

CREATE TABLE applied_post(
    id SERIAL primary key,
    user_id INTEGER,
    task_id INTEGER,
    applied_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (task_id) REFERENCES task(id)
);

CREATE TABLE messages(
    id SERIAL primary key,
    sender_id INTEGER,
    recipient_id INTEGER,
    content TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    status VARCHAR(255),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id)
);

CREATE TABLE task(
    id SERIAL primary key,
    title VARCHAR(255),
    category VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    image_task VARCHAR(255),
    creator_id INTEGER,
    offered_amt NUMERIC,
    status VARCHAR(255),
    accepted_user_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id),
    FOREIGN KEY (accepted_user_id) REFERENCES users(id)
);

CREATE TABLE task_submissions(
    id SERIAL primary key,
    task_id INTEGER,
    filename VARCHAR(255),
    created_at TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES task(id)
);

CREATE TABLE users(
    id SERIAL primary key,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    google VARCHAR(255),
    github VARCHAR(255),
    gitlab VARCHAR(255),
    popup_amt INTEGER,
    image_user VARCHAR(255),
    bank_name VARCHAR(255),
    bank_account VARCHAR(255),
    freelancer_intro VARCHAR(255),
    isadmin BOOLEAN,
    remain_amt INTEGER
);




INSERT INTO users (username, password, email, first_name, last_name, 
created_at, updated_at, image_user, bank_name, bank_account, freelancer_intro)
VALUES ('gordon@tecky.io', '$2a$10$KRvJUKlWoqlMu2Sd9uXJNuln9gtHFKghRbdT4HtruRONR5XE1b0t2',
'gordon@tecky.io', 'Gordon', 'Lau', NOW(), NOW(), 'image-1595759903631.jpeg', 'HSBC', '1233-4598-5644', 'Hi, I''m Gordon.
I''ve been in the field of programming over 10+ years. Proficient in most computer languages you''ve probably heard of.
With my strong problem-solving skills, I''m confident that I can solve your problems in this area
');

INSERT INTO users (username, password, email, first_name, last_name, 
created_at, updated_at, image_user, bank_name, bank_account, freelancer_intro)
VALUES ('sarah@tecky.io', '$2a$10$.QmlNQc3kbcfQqQlzStPgufmPOhMaTWRwfYOpjO95KdG9s0yfeY/i', 
'sarah@tecky.io', 'Sarah', 'Lee', NOW(), NOW(), 'image-1595760324487.jpeg', 'BEA', '012-5343-8964',
'Hi! I''m Sarah from Hong Kong. 
 I''m a professional track cyclist. I won the bronze medal in the women''s keirin at the 2012 London Olympics.
 I can train you to be a professional cyclist like me
 ');

INSERT INTO users (username, password, email, first_name, last_name, 
created_at, updated_at, image_user, bank_name, bank_account, freelancer_intro)
VALUES ('murakami@tecky.io', '$2a$10$B4JvZmeiWsu.rbNZDuVLqeSmG0opqByJaXMmJGb4KkK863AiEaLZ2',
'murakami@tecky.io', 'Haruki', 'Murakami', NOW(), NOW(), 'image-1595760753223.jpeg', 'ANZ', '033-7785-4920',
'Hi I''m Murakami from Japan
I write books and stories. My work have been translated into 50 languages.
Come talk to me if you want to improve your writing
');

INSERT INTO task (title, category, content, created_at, updated_at, image_task, creator_id, offered_amt, status)
VALUES ('Dog walking', 'animal caring',
'I need some to walk Haru - a very energetic Shiba.
As I need to work at daytime, I need someone who is sporty enough to dog walk Haru (probably run with him).Someone who loves being with dog would be perfect for the job.

Days & times: Every Monday and Wednesday at 2 p.m. - 3 p.m
Location: Wan Chai
Salary in hour', NOW(), NOW(), 'image-1595767526294.jpeg', 1, 100, 'open');

INSERT INTO task (title, category, content, created_at, updated_at, image_task, creator_id, offered_amt, status)
VALUES ('CS50 Pset-5 Best Solution', 'programming',
'I have already finished pset5 but I want to find the best solution.
Would be happy if someone could offer a solution that uses least memory and least time.
 You need to explain how you arrives at this solution. Don''t just copy it from somewhere else.',
 NOW(), NOW(), 'image-1595770892367.jpeg', 2, 500, 'open');

INSERT INTO task (title, category, content, created_at, updated_at, image_task, creator_id, offered_amt, status)
VALUES ('Bike Cleaning', 'physical work',
'Urgently looking for someone to clean my bike. It is muddy after I took a ride in some rural areas.
I will provide the cleaning tools and you need to come to my house to clean it. 
Location: South District 
Time: 1:00pm Monday.', NOW(), NOW(), 'image-1595771214136.jpeg', 2, 300, 'open');

INSERT INTO task (title, category, content, created_at, updated_at, image_task, creator_id, offered_amt, status)
VALUES ('Proofreading - Japanese novel', 'writing/translation',
'Need to someone to proofread my new novel which is about 500 pages.
The suitable person should at least have N1 level Japanese and be detail-oriented.  
This is a remote task with flexible deadline. Look forward to let you read my new work.',
NOW(), NOW(), 'image-1595771783676.jpeg', 3, 20000, 'open');

INSERT INTO task (title, category, content, created_at, updated_at, image_task, creator_id, offered_amt, status)
VALUES ('Movie Re-editing', 'video/animation',
'Being obsessive with the movie - In the Mood for Love, I would like to try re-edit the movie myself and see if I could create a different feel.
 I would like to some guidance and help from professional editor. It would be great if you have some film-editing experiences. Pay per hour.',
 NOW(), NOW(), 'image-1595772201428.jpeg', 3, 300, 'open');

INSERT INTO task (title, category, content, created_at, updated_at, image_task, creator_id, offered_amt, status)
VALUES ('Android App Development', 'programming',
'Looking for someone with solid experience in Kotlin and Java for Android SDK, Hybrid mobile app development method like React Native. 
It is a remote task with flexible working hours. Pay per hour.',
NOW(), NOW(), 'image-1595772857110.jpeg', 1, 500, 'open');

INSERT INTO task (title, category, content, created_at, updated_at, image_task, creator_id, offered_amt, status)
VALUES ('Web Development', 'programming',
'Hi, I want to develop an online shop for my watch business. 
Prefer someone with full-stack skills/experiences. Need to build operational website within 1 months. 
Location: Tai Koo 
Days & Hours: Mon, Wed, Fri, 2:00-6:00p.m.', NOW(), NOW(), 'image-1595773301918.jpeg', 1, 20000, 'open');

)



)