import multiprocessing
import os
import random

import arabic_reshaper
from bidi.algorithm import get_display
from moviepy.editor import VideoFileClip, CompositeAudioClip, concatenate_audioclips
from moviepy.audio.fx.audio_fadein import audio_fadein
from moviepy.audio.fx.audio_fadeout import audio_fadeout
from moviepy.audio.fx.volumex import volumex
from moviepy.audio.AudioClip import concatenate_audioclips
from moviepy.audio.io.AudioFileClip import AudioFileClip
from moviepy.video.VideoClip import ImageClip
from moviepy.video.compositing.CompositeVideoClip import clips_array, CompositeVideoClip
from moviepy.video.compositing.concatenate import concatenate_videoclips
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ThreadCount = multiprocessing.cpu_count()


def crop_video(video_path):
    # Load the video clip
    video_clip = VideoFileClip(video_path)

    # Define the dimensions for cropping
    top_crop = 40  # Pixels to crop from the top
    bottom_crop = 40  # Pixels to crop from the bottom
    left_crop = 90  # Pixels to crop from the left
    right_crop = 90  # Pixels to crop from the right

    # Calculate new dimensions
    new_width = video_clip.w - left_crop - right_crop
    new_height = video_clip.h - top_crop - bottom_crop

    # Crop the video
    video_clip = video_clip.crop(x1=left_crop, y1=top_crop, x2=left_crop + new_width, y2=top_crop + new_height)

    # Save the output video
    output_path = "output/output_video.mp4"
    video_clip.write_videofile(output_path)


def reduce_video_duration(input_file, new_duration):
    video_clip = VideoFileClip(input_file + ".mp4").without_audio()

    # Calculate the new end time based on the desired duration
    new_end_time = min(new_duration, video_clip.duration)

    # Trim the video to the new duration
    video_clip = video_clip.subclip(0, new_end_time)
    video_clip.write_videofile(input_file + "_red.mp4", preset="ultrafast")
    return video_clip


def remove_video_audio(input_file):
    video_clip = VideoFileClip(input_file + ".mp4")

    # Trim the video to the new duration
    video_clip = video_clip.without_audio()
    video_clip.write_videofile(input_file + "_m.mp4", preset="ultrafast")
    return video_clip


# def text_to_speech(text, path, lang='de'):
#     tts = gTTS(text=text, lang=lang)
#     tts.save(path)  # Save the audio file as 'output.mp3'


def crop_video_bottm_right(video_path):
    # Load the video clip
    video_clip = VideoFileClip(video_path + ".mp4")

    # if "modern/av_1" in video_path:
    #     top_crop = 0  # Pixels to crop from the top
    #     bottom_crop = 106  # Pixels to crop from the bottom
    #     left_crop = 0  # Pixels to crop from the left
    #     right_crop = video_clip.size[0] // 2  # Pixels to crop from the right
    # elif "modern/av_5" in video_path:
    #     top_crop = 0  # Pixels to crop from the top
    #     bottom_crop = 109  # Pixels to crop from the bottom
    #     left_crop = 0  # Pixels to crop from the left
    #     right_crop = video_clip.size[0] // 2  # Pixels to crop from the right
    # elif "modern/av_4" in video_path:
    #     top_crop = 3  # Pixels to crop from the top
    #     bottom_crop = 101  # Pixels to crop from the bottom
    #     left_crop = 0  # Pixels to crop from the left
    #     right_crop = video_clip.size[0] // 2  # Pixels to crop from the right
    # elif "playground/av_1" in video_path:
    #     top_crop = 0  # Pixels to crop from the top
    #     bottom_crop = 100  # Pixels to crop from the bottom
    #     left_crop = 0  # Pixels to crop from the left
    #     right_crop = video_clip.size[0] // 2  # Pixels to crop from the right
    # elif "playground/av_5" in video_path:
    #     top_crop = 0  # Pixels to crop from the top
    #     bottom_crop = 101  # Pixels to crop from the bottom
    #     left_crop = 0  # Pixels to crop from the left
    #     right_crop = video_clip.size[0] // 2  # Pixels to crop from the right
    # elif "playground/av_6" in video_path:
    #     top_crop = 0  # Pixels to crop from the top
    #     bottom_crop = 100  # Pixels to crop from the bottom
    #     left_crop = 0  # Pixels to crop from the left
    #     right_crop = video_clip.size[0] // 2  # Pixels to crop from the right
    # else:
    top_crop = 0  # Pixels to crop from the top
    bottom_crop = 108  # Pixels to crop from the bottom
    left_crop = 0  # Pixels to crop from the left
    right_crop = video_clip.size[0] // 2  # Pixels to crop from the right

    # Calculate new dimensions
    new_width = video_clip.w - left_crop - right_crop
    new_height = video_clip.h - top_crop - bottom_crop

    # Crop the video
    video_clip = video_clip.crop(x1=left_crop, y1=top_crop, x2=left_crop + new_width, y2=top_crop + new_height)
    video_clip.write_videofile(video_path + "_l.mp4", preset="ultrafast")
    # Save the output video
    return video_clip


def crop_video_bottm_left(video_path):
    video_clip = VideoFileClip(video_path + ".mp4")
    # if "modern/av_1" in video_path:
    #     top_crop = 0  # Pixels to crop from the top
    #     bottom_crop = 106  # Pixels to crop from the bottom
    #     left_crop = video_clip.size[0] // 2  # Pixels to crop from the left
    #     right_crop = 0  # Pixels to crop from the right
    # elif "modern/av_5" in video_path:
    #     top_crop = 0  # Pixels to crop from the top
    #     bottom_crop = 109  # Pixels to crop from the bottom
    #     left_crop = video_clip.size[0] // 2  # Pixels to crop from the left
    #     right_crop = 0  # Pixels to crop from the right
    # elif "modern/av_4" in video_path:
    #     top_crop = 3  # Pixels to crop from the top
    #     bottom_crop = 101  # Pixels to crop from the bottom
    #     left_crop = video_clip.size[0] // 2  # Pixels to crop from the left
    #     right_crop = 0  # Pixels to crop from the right
    # elif "playground/av_1" in video_path:
    #     top_crop = 0  # Pixels to crop from the top
    #     bottom_crop = 100  # Pixels to crop from the bottom
    #     left_crop = video_clip.size[0] // 2  # Pixels to crop from the left
    #     right_crop = 0  # Pixels to crop from the right
    # elif "playground/av_5" in video_path:
    #     top_crop = 0  # Pixels to crop from the top
    #     bottom_crop = 101  # Pixels to crop from the bottom
    #     left_crop = video_clip.size[0] // 2  # Pixels to crop from the left
    #     right_crop = 0  # Pixels to crop from the right
    # elif "playground/av_6" in video_path:
    #     top_crop = 0  # Pixels to crop from the top
    #     bottom_crop = 100  # Pixels to crop from the bottom
    #     left_crop = video_clip.size[0] // 2  # Pixels to crop from the left
    #     right_crop = 0  # Pixels to crop from the right
    # else:
    # Define the dimensions for cropping
    top_crop = 0  # Pixels to crop from the top
    bottom_crop = 108  # Pixels to crop from the bottom
    left_crop = video_clip.size[0] // 2  # Pixels to crop from the left
    right_crop = 0  # Pixels to crop from the right

    # Calculate new dimensions
    new_width = video_clip.w - left_crop - right_crop
    new_height = video_clip.h - top_crop - bottom_crop

    # Crop the video
    video_clip = video_clip.crop(x1=left_crop, y1=top_crop, x2=left_crop + new_width, y2=top_crop + new_height)
    video_clip.write_videofile(video_path + "_r.mp4", preset="ultrafast")
    return video_clip


def excessive_crop_video_bottm_top(input):
    video_clip = VideoFileClip(input + ".mp4").without_audio()

    # Load the video clip

    # Define the dimensions for cropping
    top_crop = 0  # Pixels to crop from the top
    bottom_crop = 108  # Pixels to crop from the bottom
    left_crop = 0  # Pixels to crop from the left
    right_crop = 0  # Pixels to crop from the right

    # Calculate new dimensions
    new_width = video_clip.w - left_crop - right_crop
    new_height = video_clip.h - top_crop - bottom_crop

    # Crop the video
    video_clip = video_clip.crop(x1=left_crop, y1=top_crop, x2=left_crop + new_width, y2=top_crop + new_height)
    video_clip.write_videofile(input + "_cropped.mp4", preset="ultrafast")
    return video_clip


def stick_videos_side_by_side(input_file1, input_file2, audio_file1, audio_file2, output_file, host, text):
    if host == "127.0.0.1":

        font_path = "Roboto-Bold.ttf"  # Replace with the actual path to your font file

        text_image_path = "keyword_image.png"
    else:
        font_path = "/home/explainIO/mysite/Roboto-Bold.ttf"
        text_image_path = "/home/explainIO/mysite/keyword_image.png"

    audio1 = AudioFileClip(audio_file1)
    audio2 = AudioFileClip(audio_file2)

    # audio1 = AudioFileClip("output1.mp3")
    # audio2 = AudioFileClip("output2.mp3")

    video1 = VideoFileClip(input_file1)
    video2 = VideoFileClip(input_file2)
    min_height = min(video1.size[1], video2.size[1])
    video1 = video1.resize(height=min_height)
    video2 = video2.resize(height=min_height)
    if "av_5" in input_file1 or "av_6" in input_file1:
        video1_talking = video1.subclip(3, video1.duration - 4)
    else:
        video1_talking = video1.subclip(3, video1.duration - 6)
    if "av_5" in input_file1 or "av_6" in input_file1:
        video2_talking = video2.subclip(3, video2.duration - 4)
    else:
        video2_talking = video2.subclip(3, video2.duration - 6)
    # Create a list of video clips for concatenation

    video_clips1 = []
    if "av_5" in input_file1 or "av_6" in input_file1:
        frame1 = video1_talking.subclip(0, 9)
        frame2 = video1_talking.subclip(9, 18)
        frame3 = video1_talking.subclip(18, 27)
        frame4 = video1_talking.subclip(27, 36)
        frame5 = video1_talking.subclip(36, 45)

        frames = [frame1, frame2, frame3, frame4, frame5]
    else:
        frame1 = video1_talking.subclip(0, 9)
        frame2 = video1_talking.subclip(9, 18)
        frame3 = video1_talking.subclip(18, 27)
        frame4 = video1_talking.subclip(27, 36)
        frame5 = video1_talking.subclip(36, 45)
        frame6 = video1_talking.subclip(45, 54)
        frame7 = video1_talking.subclip(54, 63)
        frames = [frame1, frame2, frame3, frame4, frame5, frame6, frame7]
    repeats = int(audio1.duration / frame1.duration) + 1
    avoid_frame = ""
    for i in range(repeats):
        random_choice = random.choice(frames)
        while True:
            if random_choice != avoid_frame:
                video_clips1.append(random_choice)
                break
            else:
                random_choice = random.choice(frames)
        avoid_frame = random_choice

    video1_talking = concatenate_videoclips(video_clips1)
    # video1_talking=video1_talking.speedx(0.75)

    video1_talking = video1_talking.set_duration(audio1.duration)
    video1_talking.audio = audio1

    video_clips2 = []
    if "av_5" in input_file2 or "av_6" in input_file2:
        frame1 = video2_talking.subclip(0, 9)
        frame2 = video2_talking.subclip(9, 18)
        frame3 = video2_talking.subclip(18, 27)
        frame4 = video2_talking.subclip(27, 36)
        frame5 = video2_talking.subclip(36, 45)

        frames = [frame1, frame2, frame3, frame4, frame5]
    else:
        frame1 = video2_talking.subclip(0, 9)
        frame2 = video2_talking.subclip(9, 18)
        frame3 = video2_talking.subclip(18, 27)
        frame4 = video2_talking.subclip(27, 36)
        frame5 = video2_talking.subclip(36, 45)
        frame6 = video2_talking.subclip(45, 54)
        frame7 = video2_talking.subclip(54, 63)
        frames = [frame1, frame2, frame3, frame4, frame5, frame6, frame7]
    repeats = int(audio2.duration / frame1.duration) + 1
    for i in range(repeats):
        random_choice = random.choice(frames)
        while True:
            if random_choice != avoid_frame:
                video_clips2.append(random_choice)
                break
            else:
                random_choice = random.choice(frames)
        avoid_frame = random_choice
    video2_talking = concatenate_videoclips(video_clips2)
    # video2_talking = video2_talking.speedx(0.75)

    video2_talking = video2_talking.set_duration(audio2.duration)
    video2_talking.audio = audio2

    # Resize the videos to have the same height

    # Create freeze frames of the first frame of each video
    if "av_5" in input_file1 or "av_6" in input_file1:

        freeze_frame1 = video1.subclip(video1.duration - 3, video1.duration)

    else:
        freeze1 = [video1.subclip(video1.duration - 1.5, video1.duration),
                   video1.subclip(video1.duration - 3.5, video1.duration - 2),
                   video1.subclip(video1.duration - 5.9, video1.duration - 4)]
        # i = 10
        # for f in freeze1:
        #     f.write_videofile(str(i) + ".mp4", preset='ultrafast')
        #     i = i + 1
        freeze_frame1 = random.choice(freeze1)

    loop_count = int(video2_talking.duration / freeze_frame1.duration) + 1
    freeze_frame1 = concatenate_videoclips([freeze_frame1] * loop_count)
    if "av_5" in input_file2 or "av_6" in input_file2:
        freeze_frame2 = video2.subclip(video2.duration - 3, video2.duration)

    else:
        freeze2 = [video2.subclip(video2.duration - 1.5, video2.duration),
                   video2.subclip(video2.duration - 3.5, video2.duration - 2),
                   video2.subclip(video2.duration - 5.9, video2.duration - 4)]
        # i = 20
        # for f in freeze2:
        #     f.write_videofile(str(i) + ".mp4", preset='ultrafast')
        #     i = i + 1
        freeze_frame2 = random.choice(freeze2)

    loop_count = int(video1_talking.duration / freeze_frame2.duration) + 1
    freeze_frame2 = concatenate_videoclips([freeze_frame2] * loop_count)

    final_clip2 = clips_array([[video1_talking, freeze_frame2]])
    final_clip2.duration = video1_talking.duration
    # if "has_keyword" in audio_file1:
    #     text_to_image_with_rounded_edges_black(text, font_path, font_size, text_image_path)
    #     text_overlay = ImageClip(text_image_path)
    #     text_overlay_position = (450, 100)
    #     text_overlay = text_overlay.set_position(text_overlay_position)
    #     text_overlay = text_overlay.set_duration(final_clip2.duration)
    #     temp_clip1 = CompositeVideoClip(clips=[final_clip2, text_overlay], use_bgclip=True)
    #     temp_clip1.audio=audio1
    #     final_clip2=temp_clip1
    #     # final_clip2.audio=temp_clip1.audio
    #     os.remove(text_image_path)

    final_clip3 = clips_array([[freeze_frame1, video2_talking]])
    final_clip3.duration = video2_talking.duration
    # if "has_keyword" in audio_file2:
    #     text_to_image_with_rounded_edges_black(text, font_path, font_size, text_image_path)
    #     text_overlay = ImageClip(text_image_path)
    #     text_overlay_position = (600, 100)
    #     text_overlay = text_overlay.set_position(text_overlay_position)
    #     text_overlay = text_overlay.set_duration(final_clip3.duration)
    #     final_clip = CompositeVideoClip(clips=[final_clip3, text_overlay], use_bgclip=True)
    #     final_clip.audio=audio2
    #     final_clip3=final_clip
    #     # final_clip3.audio = final_clip.audio
    #     os.remove(text_image_path)

    # Write the final video
    # final_video = concatenate_videoclips([final_clip2, final_clip3,final_clip4])

    final_video = concatenate_videoclips([final_clip2, final_clip3])

    # start_time = time.time()
    # for nvidia final_video.write_videofile("output_file_temp.mp4", preset="fast",codec='h264_nvenc', )

    return final_video
    # final_clip.write_videofile(output_file, preset='ultrafast')
    #
    # end_time = time.time()
    #
    # writing_time = end_time - start_time
    # print(f"Writing took {writing_time:.2f} seconds.")


def add_logo(final_video, text, temp_path, path, output_path, host, input_video1=None, input_video2=None, text2=None,
             isSolo=False, entrance=None, sfx=None, lang_code=None):
    temp_output = final_video
    # if host == "127.0.0.1":
    #     try:
    #         temp.write_videofile(temp_path, preset="ultrafast", codec='h264_nvenc')
    #     except Exception as e:
    #         temp.write_videofile(temp_path, preset='ultrafast',threads=ThreadCount)
    # else:
    #     try:
    #         temp.write_videofile(temp_path, preset="ultrafast", codec='h264_nvenc',temp_audiofile=temp_path+"TEMP_MPY_wvf_snd.mp3")
    #     except Exception as e:
    #         temp.write_videofile(temp_path, preset='ultrafast',threads=ThreadCount,temp_audiofile=temp_path+"TEMP_MPY_wvf_snd.mp3")
    # temp_output = VideoFileClip(temp_path)
    # os.remove(temp_path)
    if host == "127.0.0.1":

        image_path = "assets/velptec-logo-transparent.png"
    else:
        image_path = "/home/explainIO/mysite/assets/velptec-logo-transparent.png"

    text = text.strip()
    text = " " + text + " "
    if host == "127.0.0.1":
        if lang_code=="ar-XA":
            font_path = "NotoNaskhArabic.ttf"
        else:
            font_path = "Roboto-Bold.ttf"  # Replace with the actual path to your font file
    else:
        if lang_code=="ar-XA":
            font_path = "/home/explainIO/mysite/NotoNaskhArabic.ttf"
        else:
            font_path = "/home/explainIO/mysite/Roboto-Bold.ttf"
    font_size = 22

    text_to_image_with_rounded_edges(text, font_path, font_size, output_path)
    text_image_path = output_path

    overlay = ImageClip(image_path)
    overlay = overlay.resize(width=250)
    text_overlay = ImageClip(text_image_path)
    # text_overlay = text_overlay.resize(width=1000)
    # Adjust the width as needed

    # Step 3: Set the position of the overlay
    overlay_position = (temp_output.size[0] - overlay.size[0], 0)
    overlay = overlay.set_position(overlay_position)
    overlay = overlay.set_duration(temp_output.duration)

    text_overlay_position = (10, 10)
    text_overlay = text_overlay.set_position(text_overlay_position)
    text_overlay = text_overlay.set_duration(temp_output.duration)

    # Step 4: Composite the video with the overlay
    final_clip = CompositeVideoClip(clips=[temp_output, text_overlay], use_bgclip=True)
    final_clip.audio = temp_output.audio

    lines = text2.split('\n')

    # Add empty space between each line
    text2 = '\n\n'.join(["  " + line.strip() + "  " for line in lines])
    if lang_code=="en-US":
        text2 = f"""  Summary of this video:  
        
{text2}
            """
    elif lang_code=="fr-FR":
        text2 = f"""  Résumé de cette vidéo:  
        
{text2}
                    """
    elif lang_code=="ar-XA":
        text2 = f"""  ملخص هذا الفيديو:  
        
{text2}
                            """
        text2 = arabic_reshaper.reshape(text2)
        text2 = get_display(text2)
    else:
        text2 = f"""  Zusammenfassung dieses Videos:  
        
{text2}
                    """
    if not isSolo:
        font_size = 22
        video1 = VideoFileClip(input_video1)
        video2 = VideoFileClip(input_video2)
        min_height = min(video1.size[1], video2.size[1])
        if "av_5" in input_video1 or "av_6" in input_video1:
            freeze_frame1 = video1.subclip(video1.duration - 4, video1.duration - 2).resize(height=min_height).speedx(
                0.75)
        else:
            freeze_frame1 = video1.subclip(video1.duration - 2, video1.duration).resize(height=min_height).speedx(
                0.75)
        if "av_5" in input_video2 or "av_6" in input_video2:
            freeze_frame2 = video2.subclip(video2.duration - 4, video2.duration - 2).resize(height=min_height).speedx(
                0.75)
        else:
            freeze_frame2 = video2.subclip(video2.duration - 2, video2.duration).resize(height=min_height).speedx(
                0.75)

        final_clip4 = clips_array(
            [[freeze_frame1, freeze_frame2]])

        custom_clips = [final_clip4] * 3
        final_clip4 = concatenate_videoclips(custom_clips)

        text_to_image_with_rounded_edges_black(text2, font_path, font_size, text_image_path)
        text_overlay2 = ImageClip(text_image_path)
        image_position = (
            int((final_clip4.size[0] - text_overlay2.size[0]) / 2) - 30,  # Center horizontally
            275,  # Top of the video
        )
    else:
        freeze_frame = entrance.get_frame(
            0)  # Replace 5 with the desired time in seconds
        freeze_frame_clip = ImageClip(freeze_frame, duration=10)

        final_clip4 = clips_array([[freeze_frame_clip]])
        custom_clips = [final_clip4] * 1
        final_clip4 = concatenate_videoclips(custom_clips)
        text_to_image_with_rounded_edges_black(text2, font_path, font_size, text_image_path)
        text_overlay2 = ImageClip(text_image_path)
        image_position = (
            int((final_clip4.size[0] - text_overlay2.size[0]) / 2) + 300,  # Center horizontally
            100,  # Top of the video
        )
    text_overlay2 = text_overlay2.set_position(image_position)
    text_overlay2 = text_overlay2.set_duration(final_clip4.duration)
    text_overlay = text_overlay.set_duration(final_clip4.duration)
    overlay = overlay.set_duration(final_clip4.duration)
    temp_clip1 = CompositeVideoClip(clips=[final_clip4, text_overlay2, text_overlay], use_bgclip=True)
    final_clip4 = temp_clip1

    # final_clip2.audio=temp_clip1.audio
    # final_clip4.write_videofile("test.mp4", preset='ultrafast', threads=ThreadCount, codec='libx264')
    # final_clip4 = final_clip4.resize(final_clip.size)
    #
    # # Set the frame rate of the second clip to match the first clip
    # final_clip4 = final_clip4.set_fps(final_clip.fps)
    def custom_fade(gf, t):
        fade_duration = 1
        frame = gf(t)
        fade_in = min(1, t / fade_duration)
        fade_out = min(1, (final_clip4.duration - t) / fade_duration)
        return np.multiply(frame, fade_in * fade_out)

    # Apply the fade-in and fade-out transition to each frame
    video_clip_with_transition = final_clip4.fl(lambda gf, t: custom_fade(gf, t))
    # video_clip_with_transition=video_clip_with_transition.resize(width=final_clip.size[0],height=final_clip.size[1])
    # video_clip_with_transition = video_clip_with_transition.set_fps(final_clip.fps)

    temp_final_clip = concatenate_videoclips([final_clip, video_clip_with_transition])
    if host == "127.0.0.1":
        background_noise = AudioFileClip("assets/" + sfx)
    else:
        background_noise = AudioFileClip("/home/explainIO/mysite/assets/" + sfx)
    background_noise = background_noise.set_duration(temp_final_clip.duration)
    background_noise = volumex(background_noise, 0.1)
    mixed_audio = CompositeAudioClip([temp_final_clip.audio, background_noise])

    final_clip = temp_final_clip.set_audio(mixed_audio)

    os.remove(text_image_path)

    if host == "127.0.0.1":
        try:
            final_clip.write_videofile(path, preset="ultrafast", codec='h264_nvenc', fps=30)
        except Exception as e:
            final_clip.write_videofile(path, preset='ultrafast', threads=ThreadCount, codec='libx264', fps=24)
            # codec="libx264"  for better quality and higher file size
            # codec="hevc"  for worst quality and lower file size
            # codec="mpeg4"  for terrible  quality and lower file size


    else:
        try:
            final_clip.write_videofile(path, preset="ultrafast", codec='h264_nvenc',
                                       temp_audiofile=path + "TEMP_MPY_wvf_snd.mp3", fps=30)
        except Exception as e:
            final_clip.write_videofile(path, preset='ultrafast', threads=ThreadCount, codec='libx264',
                                       temp_audiofile=path + "TEMP_MPY_wvf_snd.mp3", fps=24)
    final_clip.close()
    if entrance is not None:
        entrance.close()


def release_video(video1, video2, video_array, output_path, position, sfx, host):
    video1 = VideoFileClip(video1)
    video2 = VideoFileClip(video2)
    if position == "first" or position == "first&last":
        min_height = min(video1.size[1], video2.size[1])
        entrance1 = video1.subclip(0, 3).resize(height=min_height)
        entrance2 = video2.subclip(0, 3).resize(height=min_height)

        final_clip1 = clips_array([[entrance1, entrance2]])
        if sfx == "classroom":
            if host == "127.0.0.1":
                bell = AudioFileClip("assets/bell.mp3")
            else:
                bell = AudioFileClip("/home/explainIO/mysite/assets/bell.mp3")
            bell = bell.set_duration(final_clip1.duration)
            bell = volumex(bell, 0.5)
            final_clip1.audio = bell
        video_array.insert(0, final_clip1)

    final_video = concatenate_videoclips(video_array)

    return final_video


def generate_thumbnail(video_path, output_path):
    clip = VideoFileClip(video_path)
    middle_time = clip.duration / 2
    middle_frame = clip.get_frame(middle_time)

    # Convert the frame to RGB format if it's not already in that format
    if len(middle_frame.shape) == 2:
        middle_frame = np.dstack([middle_frame] * 3)

    clip.save_frame(output_path, middle_time)
    clip.close()


def generate_thumbnail_podcast(text, output_path, host):
    text = text.strip()
    text = " " + text + " "
    if host == "127.0.0.1":

        font_path = "Roboto-Bold.ttf"  # Replace with the actual path to your font file
    else:
        font_path = "/home/explainIO/mysite/Roboto-Bold.ttf"
    font_size = 22

    text_to_image_with_rounded_edges(text, font_path, font_size, output_path)


def get_audio_duration(audio_path):
    audio = AudioFileClip(audio_path)
    audio.close()
    return audio.duration


def add_rounded_corners(im, radius):
    circle = Image.new('L', (radius * 2, radius * 2), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, radius * 2, radius * 2), fill=255)
    alpha = Image.new('L', im.size, 255)
    w, h = im.size
    alpha.paste(circle.crop((0, 0, radius, radius)), (0, 0))
    alpha.paste(circle.crop((0, radius, radius, radius * 2)), (0, h - radius))
    alpha.paste(circle.crop((radius, 0, radius * 2, radius)), (w - radius, 0))
    alpha.paste(circle.crop((radius, radius, radius * 2, radius * 2)), (w - radius, h - radius))
    im.putalpha(alpha)
    return im


def text_to_image_with_rounded_edges(text, font_path, font_size, output_path):
    # Create a font object
    font = ImageFont.truetype(font_path, font_size)

    # Calculate text size using textbbox
    bbox = ImageDraw.Draw(Image.new('RGBA', (1, 1))).textbbox((0, -10), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Create a new image with white background
    img = Image.new('RGBA', (text_width, text_height + 20), color=(255, 255, 255, 255))
    d = ImageDraw.Draw(img)

    # Add the text to the image
    d.text((-bbox[0], -bbox[1]), text, font=font, fill=(0, 0, 0))

    # Add rounded corners
    radius = 5  # Adjust this value to control the roundness of the corners
    img_with_corners = add_rounded_corners(img, radius)

    # Save the image
    img_with_corners.save(output_path, format="PNG")


def text_to_image_with_rounded_edges_black(text, font_path, font_size, output_path):
    # Create a font object
    font = ImageFont.truetype(font_path, font_size)

    # Calculate text size using textbbox
    bbox = ImageDraw.Draw(Image.new('RGBA', (1, 1))).textbbox((0, -10), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Create a new image with white background
    img = Image.new('RGBA', (text_width, text_height + 20), color=(128, 128, 128, 255))
    # color=(102, 153, 204, 255) fore light blue , color=(90, 90, 90, 255) for dark gray , color=(235, 87, 87, 255) for light red
    d = ImageDraw.Draw(img)

    # Add the text to the image
    d.text((-bbox[0], -bbox[1]), text, font=font, fill=(255, 255, 255))

    # Add rounded corners
    radius = 20  # Adjust this value to control the roundness of the corners
    img_with_corners = add_rounded_corners(img, radius)

    # Save the image
    img_with_corners.save(output_path, format="PNG")


def stick_videos_mono(input_file, audio_file, output_file, position, host):
    audio = AudioFileClip(audio_file)

    video = VideoFileClip(input_file)
    entrance = video.subclip(0, 3)
    outro = video.subclip(video.duration - 4, video.duration)
    if "classroom" in input_file:
        if host == "127.0.0.1":
            bell = AudioFileClip("assets/bell.mp3")
        else:
            bell = AudioFileClip("/home/explainIO/mysite/assets/bell.mp3")
        bell = bell.set_duration(entrance.duration)
        bell = volumex(bell, 0.5)
        entrance.audio = bell
        outro.audio = bell
    video_talking = video.subclip(3, video.duration - 3)
    temp_video_talking = video_talking

    repeats = int(audio.duration / video_talking.duration) + 1
    # Create a list of video clips for concatenation
    video_clips1 = []
    print(video_talking.duration)
    if "av_5" in input_file or "av_6" in input_file:
        frame1 = video_talking.subclip(0, 9)
        frame2 = video_talking.subclip(9, 18)
        frame3 = video_talking.subclip(18, 27)
        frame4 = video_talking.subclip(27, 36)

        frames = [frame1, frame2, frame3, frame4]


    else:
        frame1 = video_talking.subclip(0, 9)
        frame2 = video_talking.subclip(9, 18)
        frame3 = video_talking.subclip(18, 27)
        frame4 = video_talking.subclip(27, 36)
        frame5 = video_talking.subclip(36, 45)
        frame6 = video_talking.subclip(45, 54)

        frames = [frame1, frame2, frame3, frame4, frame5, frame6]
    repeats = int(audio.duration / frame1.duration) + 1

    avoid_frame = ""
    for i in range(repeats):
        random_choice = random.choice(frames)
        while True:
            if random_choice != avoid_frame:
                video_clips1.append(random_choice)
                break
            else:
                random_choice = random.choice(frames)
        avoid_frame = random_choice

    video_talking = concatenate_videoclips(video_clips1)
    # video_clips = [video_talking] * repeats
    #
    # video_talking = concatenate_videoclips(video_clips)

    video_talking = video_talking.set_duration(audio.duration)
    video_talking.audio = audio
    if position == "first":
        final_video = concatenate_videoclips([entrance, video_talking])
    elif position == "last":
        final_video = concatenate_videoclips([video_talking, outro])
    elif position == "first&last":
        final_video = concatenate_videoclips([entrance, video_talking, outro])
    else:
        final_video = concatenate_videoclips([video_talking])
    return final_video, temp_video_talking


def combine_mp3_files(input_files, output_file):
    audio_clips = [AudioFileClip(file) for file in input_files]
    combined_audio = concatenate_audioclips(audio_clips)
    combined_audio.write_audiofile(output_file, codec='mp3')
    combined_audio.close()

    for my_clip in audio_clips:
        my_clip.close()


def add_podcast_effects(speech_file, output_path, intro_path, position, host):
    speech_audio = AudioFileClip(speech_file)
    if position == "first" or position == "first&last":
        intro_audio = AudioFileClip(intro_path)
    if host == "127.0.0.1":
        jingle = AudioFileClip("assets/Jingle_final.mp3")
        background_music = AudioFileClip("assets/sunrise-groove-176565.mp3")
    else:
        jingle = AudioFileClip("/home/explainIO/mysite/assets/Jingle_final.mp3")
        background_music = AudioFileClip("/home/explainIO/mysite/assets/sunrise-groove-176565.mp3")
    fadein_duration = 0  # Adjust as needed
    fadeout_duration = 2  # Adjust as needed
    jingle = audio_fadein(jingle, fadein_duration).fx(audio_fadeout, fadeout_duration)
    # Load the background music
    intro_music = volumex(background_music, 0.1)
    intro_music = intro_music.subclip(0, 5)
    fadein_duration = 2  # Adjust as needed
    fadeout_duration = 2  # Adjust as needed
    intro_music = audio_fadein(intro_music, fadein_duration).fx(audio_fadeout, fadeout_duration)
    background_music = volumex(background_music, 0.01)

    # Adjust the duration of the background music to match the speech audio
    background_music = background_music.subclip(10, background_music.duration)
    background_music = background_music.set_duration(speech_audio.duration)

    # Apply fade-in and fade-out effects to the background music
    fadein_duration = 0  # Adjust as needed
    fadeout_duration = 2  # Adjust as needed
    background_music = audio_fadein(background_music, fadein_duration).fx(audio_fadeout, fadeout_duration)

    # Combine the speech audio and background music
    final_audio = CompositeAudioClip([speech_audio, background_music]).set_fps(background_music.fps)
    if position == "first":
        final_audio = concatenate_audioclips([intro_music, intro_audio, jingle, final_audio])
    if position == "last":
        final_audio = concatenate_audioclips([final_audio, jingle])
    if position == "first&last":
        final_audio = concatenate_audioclips([intro_music, intro_audio, jingle, final_audio, jingle])

    # Write the final audio to a file
    # Get the directory and extension of the file
    directory, old_filename = os.path.split(output_path)
    filename, extension = os.path.splitext(old_filename)
    final_audio.write_audiofile(f"{filename}_temp{extension}", codec='mp3')
    final_audio.close()
    temp_audio = AudioFileClip(f"{filename}_temp{extension}")
    temp_audio.write_audiofile(output_path, codec='mp3')
    temp_audio.close()
    os.remove(f"{filename}_temp{extension}")
